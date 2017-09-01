const PlayerState = require('Game/Player/PlayerState.js');
const UpdateScoreState = require('Game/Player/UpdateScoreState.js');
const possibleStates = require("events/GameEvents.js");

class DisplaySongWaitState extends PlayerState {
    constructor(playerController, score, displayName) {
        super(playerController, score, displayName);
        this.stateId = possibleStates.ChooseSongState;
        //There's no move to make from player in this state.
        this.madeMove = true;
    }

    updateState(gameData) {
        let newState = new UpdateScoreState(this.playerController, this.score, displayName);
        newState.playerController.updateState(newState.stateId, gameData);
        return newState;
    }
}

module.exports = DisplaySongWaitState;