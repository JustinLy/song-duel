import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';

class GameRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameId: props.match.params.gameId
        }
    }
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Song Duel</h2>
                </div>
                <p className="App-intro">
                    Joining game id: {this.state.gameId}
                </p>
            </div>
        );
    }
}

export default GameRoom;
