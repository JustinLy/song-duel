let PlayerState = require('Game/Player/PlayerState.js');

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