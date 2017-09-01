const PlayerState = require('Game/Player/PlayerState.js');
const DisplaySongWaitState = require('Game/Player/DisplaySongWaitState.js');
const possibleStates = require("events/GameEvents.js");

class ChooseSongState extends PlayerState {
    constructor(playerController, score, displayName) {
        super(playerController, score, displayName);
        this.stateId = possibleStates.ChooseSongState;
    }

    updateState(gameData) {
        let newState = new DisplaySongWaitState(this.playerController, this.score, displayName);
        newState.playerController.updateState(newState.stateId, gameData);
        return newState;
    }
}

module.exports = ChooseSongState;