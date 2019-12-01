import React, { Component } from 'react';
import axios from 'axios'
import Results from './Results.js'
import './App.css';

const API_BASE_URL = "https://rata.digitraffic.fi/api/v1/";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      departureCode: undefined,
      arrivalCode: undefined,
      departures:
      {
        track: undefined,
        time: undefined,
        station: undefined
      },
      arrivals:
      {
        track: undefined,
        time: undefined,
        station: undefined
      },
      depFound: undefined,
      arrFound: undefined,
      submitted: undefined,
      train: undefined
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toCode = this.toCode.bind(this);
    this.update = this.update.bind(this);
  }

  async toCode(evt) {
    let response = await axios.get(`${API_BASE_URL}metadata/stations`);
    let data = response.data;
    for (let i = 0; i < data.length; i++) {
      if (data[i].stationName.toLowerCase() === evt.toLowerCase() || evt.toLowerCase() + " asema" === data[i].stationName.toLowerCase()) {
        return data[i].stationShortCode;
      }
    }
    return false
  }

  update(data, code, type, found, group, station) {
    for (let i = 0; i < data[0].timeTableRows.length; i++) {
      if (data[0].timeTableRows[i].stationShortCode === code && data[0].timeTableRows[i].type === type) {
        let time = new Date(data[0].timeTableRows[i].scheduledTime);
        this.setState({
          [group]: {
            track: data[0].timeTableRows[i].commercialTrack,
            time: (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) +
              ':' +
              (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()),
            station: station
          },
          [found]: true
        })
        break;
      } else {
        this.setState({
          [found]: false
        })
      }
    }
  }

  async handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  async handleSubmit(evt) {
    evt.preventDefault();
    let depCode = await this.toCode(this.state.depStation);
    let arrCode = await this.toCode(this.state.arrStation);

    this.setState({
      departureCode: depCode,
      arrivalCode: arrCode,
      depFound: undefined,
      arrFound: undefined,
      train: this.state.trainNumber
    })

    let response = await axios.get(`${API_BASE_URL}trains/latest/${this.state.trainNumber}`);
    let data = response.data;

    if (depCode !== undefined && arrCode !== undefined && data.length !== 0) {

      this.update(data, this.state.departureCode, "DEPARTURE", "depFound", "departures", this.state.depStation);
      this.update(data, this.state.arrivalCode, "ARRIVAL", "arrFound", "arrivals", this.state.arrStation);

      this.setState({
        submitted: true
      })
    } else {
      this.setState({
        submitted: false,
        depFound: false,
        arrFound: false
      })
    }
  }

  render() {
    return (
      <div className="form">
        <form onSubmit={this.handleSubmit}>
          <label>
            Junan lähtöasema
          </label>
          <input type="text" name="depStation" onChange={this.handleChange} required></input>
          <label>
            Junan kohdeasema
          </label>
          <input type="text" name="arrStation" onChange={this.handleChange} required></input>
          <label>
            Junan numero
          </label>
          <input type="number" name="trainNumber" onChange={this.handleChange} required></input>
          <button className="btn btn-info">Hae tiedot</button>
        </form>
        {this.state.submitted === true && this.state.depFound === true && this.state.arrFound === true ? <Results
          depStation={this.state.departures.station}
          arrStation={this.state.arrivals.station}
          dtrack={this.state.departures.track}
          dtime={this.state.departures.time}
          atrack={this.state.arrivals.track}
          atime={this.state.arrivals.time} /> : undefined}
        {this.state.departureCode === false ? <p id="boi">Lähtöasemaa ei löytynyt.</p> : undefined}
        {this.state.arrivalCode === false ? <p id="boi">Kohdeasemaa ei löytynyt.</p> : undefined}
        {this.state.depFound === false || this.state.arrFound === false ? <p id="boi">Juna numero {this.state.train} ei kulje annettua reittiä.</p> : undefined}
      </div>
    )
  }
}

export default App;
