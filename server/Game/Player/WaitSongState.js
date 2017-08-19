let PlayerState = require('Game/Player/PlayerState.js');

class WaitSongState extends PlayerState {
    constructor(playerController, score, displayName) {
        super(playerController, score, displayName);
        this.stateId = possibleStates.WAIT_SONG;
    }

    updateState(gameData) {
        let newState = new DisplaySongAnswerState(this.playerController, this.score, displayName);
        newState.playerController.updateState(newState.stateId, gameData);
        return newState;
    }
}