import React, { Component } from 'react';
import './Home.css';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import NumberInput from 'material-ui-number-input';
import CopyToClipboard from 'react-copy-to-clipboard';
import TextField from 'material-ui/TextField';
import DuelService from './services/DuelService.js';
import logo from './resources/logo.png';
import IconButton from 'material-ui/IconButton';

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

    onDialogOk(e) {
        e.preventDefault();

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

    onDialogCancel(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
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
        this.props.history.push(`/game/${this.state.gameId}`);
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
                    <h1>Song Duel</h1>
                </div>
                <p className="App-intro">
                    Welcome to Song Duel, a game where you can challenge your friends's music knowledge!<br />
                    Players take turns selecting a song from Spotify's vast collection of songs. <br />
                    A multiple-choice question is then generated containing that song and similar songs
                    while a 30s preview of the song plays.<br />
                    The player will then try to guess the song correctly.
                </p>
                <br />
                <RaisedButton label="New Game" onClick={this.onNewGameClick} primary={true} />
                <br /><br />
                <img src={logo} alt="logo" style={{ width: "35%" }} />
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
                    <TextField
                        defaultValue={this._createJoinUrl(this.state.gameId)}
                        floatingLabelText="Send this URL to your friend"
                        style={{
                            width: "90%",
                            marginRight: "0.5em"
                        }}
                        floatingLabelFixed={true}
                    />
                    {/* <span className="JoinUrl">Join URL: {this._createJoinUrl(this.state.gameId)}</span> */}
                    <CopyToClipboard text={this._createJoinUrl(this.state.gameId)}>
                        <button>Copy</button>
                    </CopyToClipboard>
                </Dialog>
            </div>
        )
    }

    _createJoinUrl(gameId) {
        return `${window.location.protocol}//${window.location.hostname}:${window.location.port}/game/${gameId}`;
    }
}

export default Home;