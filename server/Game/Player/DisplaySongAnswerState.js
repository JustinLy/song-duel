const PlayerState = require('Game/Player/PlayerState.js');
const UpdateScoreState = require('Game/Player/UpdateScoreState.js');

class DisplaySongAnswerState extends PlayerState {
    constructor(playerController, score, displayName) {
        super(playerController, score, displayName);
        this.stateId = possibleStates.ChooseSongState;
    }

    updateState(gameData) {
        let newState = new UpdateScoreState(this.playerController, this.score, displayName);
        newState.playerController.updateState(newState.stateId, gameData);
        return newState;
    }
}