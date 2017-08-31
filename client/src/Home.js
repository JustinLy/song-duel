import React, { Component } from 'react';
import logo from './logo.svg';
import './Home.css';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import NumberInput from 'material-ui-number-input';

import DuelService from './services/DuelService.js';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newGameDialogOpen: false,
            endScore: 3,
            joinDialogOpen: false
        };

        this.onNewGameClick = this.onNewGameClick.bind(this);
        this.onDialogOk = this.onDialogOk.bind(this);
        this.onDialogCancel = this.onDialogCancel.bind(this);
        this.onEndScoreChanged = this.onEndScoreChanged.bind(this);

        //Join dialog
        this.onJoinCancel = this.onJoinCancel.bind(this);
        this.onJoinOk = this.onJoinOk.bind(this);

    }

    onNewGameClick() {
        //pop up dialog asking for end score
        //on confirm send create request. 

        this.setState({
            newGameDialogOpen: true
        })
    }

    onDialogOk() {
        DuelService.createNewGame(this.state.endScore).then((gameId) => {
            this.setState({
                joinDialogOpen: true,
                gameId: gameId
            });
        });
        this.setState({
            newGameDialogOpen: false
        });
    }

    onDialogCancel() {
        this.setState({
            newGameDialogOpen: false
        });
    }

    onEndScoreChanged(value) {
        this.setState({
            endScore: value
        });
    }

    onJoinCancel() {
        this.setState({
            joinDialogOpen: false
        });
    }

    onJoinOk() {
        console.log("joining game");
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.onDialogCancel}
                key="create-cancel"
            />,
            <FlatButton
                label="Ok"
                primary={true}
                keyboardFocused={true}
                onClick={this.onDialogOk}
                key="create-ok"
            />,
        ];

        const joinActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.onJoinCancel}
                key="join-cancel"
            />,
            <FlatButton
                label="Join"
                primary={true}
                keyboardFocused={true}
                onClick={this.onJoinOk}
                key="join-ok"
            />
        ];

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Song Duel</h2>
                </div>
                <p className="App-intro">
                    Welcome to Song Duel! In this game, players take turns selecting
                songs from Spotify and generating a multiple choice question to
                the other players while a 30s preview of the song plays.
                Players will then try to correctly guess the playing song.
                </p>
                <RaisedButton label="New Game" onClick={this.onNewGameClick} />
                <Dialog
                    title="Create new game"
                    actions={actions}
                    modal={false}
                    open={this.state.newGameDialogOpen}
                    onRequestClose={this.onDialogCancel}
                >
                    <NumberInput
                        id="num"
                        required
                        floatingLabelText="Points to win"
                        defaultValue={3}
                        min={1}
                        max={100}
                        strategy="allow"
                        onValid={this.onEndScoreChanged}
                    />
                </Dialog>

                <Dialog
                    title="Game created"
                    actions={joinActions}
                    modal={false}
                    open={this.state.joinDialogOpen}
                    onRequestClose={this.onJoinCancel}
                >
                    Join URL: {this._createJoinUrl(this.state.gameId)}
                </Dialog>
            </div>
        )
    }

    _createJoinUrl(gameId) {
        return `${window.location.hostname}/game/${gameId}`;
    }
}

export default Home;