let PlayerState = require('Game/Player/PlayerState.js');
const DisplaySongAnswerState = require('Game/Player/DisplaySongAnswerState.js');

class WaitSongState extends PlayerState {
    constructor(playerController, score, displayName) {
        super(playerController, score, displayName);
        this.stateId = possibleStates.WAIT_SONG;

        //No need for player to make move here as they're waiting for song
        this.madeMove = true;
    }

    updateState(gameData) {
        let newState = new DisplaySongAnswerState(this.playerController, this.score, displayName);
        newState.playerController.updateState(newState.stateId, gameData);
        return newState;
    }
}