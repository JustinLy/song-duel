const PlayerState = require('Game/Player/PlayerState.js');
const possibleStates = require("events/GameEvents.js");

class ChooseSongState extends PlayerState {
    constructor(playerController, score, displayName) {
        super(playerController, score, displayName);
        this.stateId = possibleStates.CHOOSE_SONG;
    }

    updateState(gameData) {
        const DisplaySongWaitState = require('Game/Player/DisplaySongWaitState.js');

        let newState = new DisplaySongWaitState(this.playerController, this.score, this.displayName);
        newState.playerController.updateState(newState.stateId, gameData);
        return newState;
    }
}

module.exports = ChooseSongState;