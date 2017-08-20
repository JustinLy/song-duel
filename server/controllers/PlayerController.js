'use strict'
let action = require('PlayerActions.js');

class PlayerController {
    constructor(socket, game) {
        this.socket = socket;
        this.game = game;

        //Attach listeners to socket for player actions
        socket.on(actions.SELECTED_SONG, function(data) {
            this.game.onSongSelected(data.songId);
        });

        socket.on(actions.ANSWERED, function(data) {
            this.game.onAnswered(data.songId);
        });

    }

    notifyPlayerJoined(playerList) {
        this.socket.nsp.to(this.game.gameId).emit("PLAYER_JOINED", {'playerList' : playerList});
    }

    updateState(newStateId, gameData) {
        this.socket.emit(newStateId, gameData);
    }
}