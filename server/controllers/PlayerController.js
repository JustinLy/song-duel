'use strict'
let actions = require('events/PlayerEvents.js');
let gameEvents = require('events/GameEvents.js');

class PlayerController {
    constructor(socket, game) {
        this.socket = socket;
        this.game = game;

        //Attach listeners to socket for player actions
        socket.on(actions.SELECTED_SONG, (data) => {
            this.game.onSongSelected(data.songId, this.socket.playerId);
        });

        socket.on(actions.ANSWERED, (data) => {
            this.game.onAnswered(data.songId, this.socket.playerId);
        });

        socket.on(actions.READY_FOR_NEXT_ROUND, (data) => {
            this.game.onReadyForNextRound(this.socket.playerId);
        });

        socket.on(actions.SEARCH, (data) => {
            this.game.search(data.query).then((songs) => {
                this.socket.emit(gameEvents.SEARCH_RESULTS, {
                    "songs": songs
                });
            });
        });
    }

    updateState(newStateId, gameData) {
        this.socket.emit(newStateId, gameData);
    }

    destroy() {
        this.socket.disconnect(true);
        this.game = null;
    }
}

module.exports = PlayerController;