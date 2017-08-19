'use strict'

class PlayerController {
    constructor(socket, game) {
        this.socket = socket;
        this.game = game;

        //TODO: Do socket on initializations here:

    }

    notifyPlayerJoined(playerList) {
        this.socket.nsp.to(this.game.gameId).emit("PLAYER_JOINED", {'playerList' : playerList});
    }

    updateState(newStateId, gameData) {
        this.socket.emit(newStateId, gameData);
    }
}