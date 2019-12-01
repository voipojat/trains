import React, { Component } from 'react'
import './Results.css'


class Results extends Component {
    render() {
        return (
            <div className="answer">
                <div>
                    <p id="station">{this.props.depStation.charAt(0).toUpperCase() + this.props.depStation.slice(1)}</p>
                    <p>Raide: {this.props.dtrack}</p>
                    <p>Arvioitu lähtöaika: {this.props.dtime}</p>
                </div>
                <div>
                    <p id="station">{this.props.arrStation.charAt(0).toUpperCase() + this.props.arrStation.slice(1)}</p>
                    <p>Raide: {this.props.atrack}</p>
                    <p>Arvioitu saapumisaika: {this.props.atime}</p>
                </div>
            </div>
        )
    }
}


export default Results




