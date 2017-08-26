const PlayerState = require('Game/Player/PlayerState.js');
const ChooseSongState = require('Game/Player/ChooseSongState.js');
const WaitSongState = require('Game/Player/WaitSongState.js');

class WaitGameStartState extends PlayerState {
    constructor(playerController, score, displayName) {
        super(playerController, score, displayName);
        this.stateId = possibleStates.WAIT_GAME_START;

        //There's no move to be made by player in this state.
        this.madeMove = true;
    }

    updateState(gameData) {
        let newState = null;
        if (gameData.isChoosingSong) {
            newState = new ChooseSongState(this.playerController, this.score, displayName);
        } else {
            newState = new WaitSongState(this.playerController, this.score, displayName);     
        }
        this.playerController.updateState(newState.stateId, gameData);
        return newState;    
    }
}