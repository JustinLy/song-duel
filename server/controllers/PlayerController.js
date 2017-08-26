'use strict'
let actions = require('events/PlayerEvents.js');
let gameEvents = require('events/GameEvents.js');

class PlayerController {
    constructor(socket, game) {
        this.socket = socket;
        this.game = game;

        //Attach listeners to socket for player actions
        socket.on(actions.SELECTED_SONG, (data) => {
            this.game.onSongSelected(data.songId);
        });

        socket.on(actions.ANSWERED, (data) => {
            this.game.onAnswered(data.songId, this.socket.playerId);
        });

        socket.on(actions.READY_FOR_NEXT_ROUND, (data) => {
            this.game.onReadyForNextRound(this.socket.playerId);
        });
    }

    //TODO: Remove these when confirmed we don't need.
    // notifyPlayerJoined(playerList) {
    //     this.socket.nsp.to(this.game.gameId).emit(gameEvents.NEW_PLAYER, {'playerList' : playerList});
    // }

    // notifyNewAnswer(answerSongId) {
    //     this.socket.nsp.to(this.game.gameId).emit(gameEvents.NEW_ANSWER, {'answerSongId' : answerSongId});
    // }

    updateState(newStateId, gameData) {
        this.socket.emit(newStateId, gameData);
    }

    destroy() {
        this.socket.close();
        this.game = null;
    }
}

module.exports = PlayerController;