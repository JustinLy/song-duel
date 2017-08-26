const PlayerState = require('Game/Player/PlayerState.js');
const ChooseSongState = require('Game/Player/ChooseSongState.js');
const WaitSongState = require('Game/Player/WaitSongState.js');

class UpdateScoreState extends PlayerState {
    constructor(playerController, score, displayName) {
        super(playerController, score, displayName);
        this.stateId = possibleStates.WAIT_GAME_START;

        //this.makeMove is false here because we want to wait for the client
        //to send the READY_FOR_NEXT_ROUND event after they've had time to view results
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