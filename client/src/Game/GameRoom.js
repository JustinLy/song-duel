import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';

import GameService from '../services/GameService.js';
import PlayerEvents from '../common/PlayerEvents.js';
import GameEvents from '../common/GameEvents.js';

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
            displayName: ""
        }

        this.onDialogCancel = this.onDialogCancel.bind(this);
        this.onDialogOk = this.onDialogOk.bind(this);
        this.onDisplayNameChange = this.onDisplayNameChange.bind(this);
    }

    componentDidMount() {
        //Attach all socket event listeners
        GameService.onEvent(GameEvents.NEW_PLAYER, this.onNewPlayer.bind(this));
    }

    onNewPlayer(data) {
        this.setState({
            scoreMap: data.scoreMap
        });
    }

    onDisplayNameChange(event) {
        this.setState({
            displayName: event.target.value
        });
    }

    onDialogCancel() {
        this.setState({
            nameDialogOpen: false
        });
    }

    onDialogOk() {
        if (this.state.displayName) {
            //Now that player has selected name they can join the game
            GameService.sendEvent(PlayerEvents.JOIN, {
                gameId: this.state.gameId,
                displayName: this.state.displayName
            });
        }

        this.setState({
            nameDialogOpen: false
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
                    keyboardFocused={true}
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
                >
                    <TextField
                        id="name-field"
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

            return (
                <Table>
                    <TableBody displayRowCheckbox={false}>{scoreRows}</TableBody>
                </Table>
            );
        }

    }
}

export default GameRoom;
