import React, { Component } from 'react';
import logo from '../logo.svg';
import '../GameRoom.css';

import GameService from '../services/GameService.js';
import PlayerEvents from '../common/PlayerEvents.js';
import GameEvents from '../common/GameEvents.js';
import TurnDescriptions from "./TurnDescriptions.js";

import QuestionPanel from "./QuestionPanel.js";
import SearchBar from "./SearchBar.js";

import Container from 'muicss/lib/react/container';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';


class GameRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameId: props.match.params.gameId,
            nameDialogOpen: true,
            displayName: "",
            turnDescription: "Waiting for all players to join",
            choosingSong: false,
            question: null,
            songUrl: null,
            answering: false
        }

        this.onDialogCancel = this.onDialogCancel.bind(this);
        this.onDialogOk = this.onDialogOk.bind(this);
        this.onDisplayNameChange = this.onDisplayNameChange.bind(this);
        this.onSongSelected = this.onSongSelected.bind(this);
        this.onAnswer = this.onAnswer.bind(this);
    }

    componentDidMount() {
        //Attach all socket event listeners
        GameService.onEvent(GameEvents.NEW_PLAYER, this.onNewPlayer.bind(this));
        GameService.onEvent(GameEvents.CHOOSE_SONG, this.onChooseSong.bind(this));
        GameService.onEvent(GameEvents.WAIT_SONG, this.onWaitSong.bind(this));
        GameService.onEvent(GameEvents.DISPLAY_SONG_ANSWER, this.onDisplayQuestionAnswer.bind(this));
        GameService.onEvent(GameEvents.DISPLAY_SONG_WAIT, this.onDisplayQuestionWait.bind(this));
        GameService.onEvent(GameEvents.UPDATE_SCORE, this.onUpdateScore.bind(this));
        GameService.onEvent(GameEvents.PLAYER_WON, this.onPlayerWon.bind(this));
    }

    /********** Define socket game event handlers **********/

    onNewPlayer(data) {
        this.setState({
            scoreMap: data.scoreMap
        });
    }

    onChooseSong(data) {
        this.setState({
            turnDescription: TurnDescriptions.getDescription(GameEvents.CHOOSE_SONG),
            choosingSong: true
        });
    }

    onWaitSong(data) {
        this.setState({
            turnDescription: TurnDescriptions.getDescription(GameEvents.WAIT_SONG),
        });
    }

    onDisplayNameChange(event) {
        this.setState({
            displayName: event.target.value
        });
    }

    onDisplayQuestionAnswer(data) {
        this.setState({
            turnDescription: TurnDescriptions.getDescription(GameEvents.DISPLAY_SONG_ANSWER),
            question: data.question,
            answering: true
        });
    }

    onDisplayQuestionWait(data) {
        this.setState({
            turnDescription: TurnDescriptions.getDescription(GameEvents.DISPLAY_SONG_WAIT),
            question: data.question,
            answering: false
        });
    }

    onUpdateScore(data) {
        this.setState({
            scoreMap: data.scoreMap
        }, () => {
            setTimeout(() => {
                this.setState({
                    question: null
                });
                GameService.sendEvent(PlayerEvents.READY_FOR_NEXT_ROUND, {});
            }, 2000);
        });
    }

    onPlayerWon(data) {
        this.setState({
            turnDescription: `${data.winner} has won!`,
            choosingSong: false,
            answering: false
        });
    }

    /********** UI event handlers **********/

    onDialogCancel(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        console.log("cancelled");
        this.setState({
            nameDialogOpen: false
        });
    }

    onDialogOk(e) {
        e.preventDefault();
        console.log("pressed ok " + e);
        this.setState({
            nameDialogOpen: false
        });

        if (this.state.displayName) {
            //Now that player has selected name they can join the game
            GameService.sendEvent(PlayerEvents.JOIN, {
                gameId: this.state.gameId,
                displayName: this.state.displayName
            });
        }
    }

    onSongSelected(songId) {
        this.setState({
            choosingSong: false
        });
        GameService.sendEvent(PlayerEvents.SELECTED_SONG, {
            songId: songId
        });
    }

    onAnswer(songId) {
        this.setState({
            answering: false
        });
        GameService.sendEvent(PlayerEvents.ANSWERED, {
            songId: songId
        });
    }

    render() {
        if (!this.state.scoreMap) {
            const actions = [
                <FlatButton
                    label="Cancel"
                    primary={true}
                    onClick={this.onDialogCancel}
                    key="name-cancel"
                />,
                <FlatButton
                    label="Ok"
                    primary={true}
                    onClick={this.onDialogOk}
                    key="name-ok"
                />,
            ];
            return (
                <Dialog
                    title="Choose a display name"
                    actions={actions}
                    modal={false}
                    open={this.state.nameDialogOpen}
                    onRequestClose={this.onDialogCancel}
                    keyboardFocused={true}
                >
                    <TextField
                        id="name-field"
                        autoFocus
                        value={this.state.displayName}
                        onChange={this.onDisplayNameChange}

                    />
                </Dialog>
            )

        } else {
            //Make rows for player scoreboard
            let scoreRows = [];
            this.state.scoreMap.forEach((entry, index) => {
                scoreRows.push(
                    <TableRow key={`player-entry-${index}`}>
                        <TableRowColumn>{entry.displayName}</TableRowColumn>
                        <TableRowColumn>{entry.score}</TableRowColumn>
                    </TableRow>
                );
            });

            //Scoreboard style
            let scoreboardStyle = {
                // float: "right",
                width: "100%"
            };

            return (
                // <Container fluid={true}>

                //     <Container fluid={true}>
                //         <Row>
                //             <Col md="12">{this.state.turnDescription}</Col>
                //         </Row>
                //     </Container>
                //     <Table
                //         className="Scoreboard"
                //         style={scoreboardStyle}
                //     >
                //         <TableBody displayRowCheckbox={false}>{scoreRows}</TableBody>
                //     </Table >

                // </Container>

                <Container fluid={true}>
                    <Row>
                        <Col md="9">
                            <Container fluid={true}>
                                <Row>
                                    <Col md="12">{this.state.turnDescription}</Col>
                                </Row>

                                <Row>
                                    <Col md="12">
                                        <QuestionPanel
                                            question={this.state.question}
                                            canAnswer={this.state.answering}
                                            onAnswer={this.onAnswer}
                                        />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md="12">
                                        <SearchBar
                                            enabled={this.state.choosingSong}
                                            onItemSelected={this.onSongSelected} />
                                    </Col>
                                </Row>
                            </Container>
                        </Col>

                        <Col md="3">
                            <Table
                                className="Scoreboard"
                                style={scoreboardStyle}
                            >
                                <TableBody displayRowCheckbox={false}>{scoreRows}</TableBody>
                            </Table >
                        </Col>
                    </Row>
                </Container>
            )

        }

    }
}

export default GameRoom;
