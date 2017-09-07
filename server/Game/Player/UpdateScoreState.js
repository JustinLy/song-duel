const PlayerState = require('Game/Player/PlayerState.js');
const possibleStates = require("events/GameEvents.js");

class UpdateScoreState extends PlayerState {
    constructor(playerController, score, displayName) {
        super(playerController, score, displayName);
        this.stateId = possibleStates.UPDATE_SCORE;

        //this.makeMove is false here because we want to wait for the client
        //to send the READY_FOR_NEXT_ROUND event after they've had time to view results
    }

    updateState(gameData) {
        const ChooseSongState = require('Game/Player/ChooseSongState.js');
        const WaitSongState = require('Game/Player/WaitSongState.js');

        let newState = null;
        if (gameData.isChoosingSong) {
            newState = new ChooseSongState(this.playerController, this.score, this.displayName);
        } else {
            newState = new WaitSongState(this.playerController, this.score, this.displayName);
        }
        this.playerController.updateState(newState.stateId, gameData);
        return newState;
    }
}

module.exports = UpdateScoreState;