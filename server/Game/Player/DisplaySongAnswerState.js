const PlayerState = require('Game/Player/PlayerState.js');
const possibleStates = require("events/GameEvents.js");

class DisplaySongAnswerState extends PlayerState {
    constructor(playerController, score, displayName) {
        super(playerController, score, displayName);
        this.stateId = possibleStates.DISPLAY_SONG_ANSWER;
    }

    updateState(gameData) {
        const UpdateScoreState = require('Game/Player/UpdateScoreState.js');

        let newState = new UpdateScoreState(this.playerController, this.score, this.displayName);
        newState.playerController.updateState(newState.stateId, gameData);
        return newState;
    }
}

module.exports = DisplaySongAnswerState;