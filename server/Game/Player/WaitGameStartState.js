const PlayerState = require('Game/Player/PlayerState.js');
const possibleStates = require("events/GameEvents.js");

class WaitGameStartState extends PlayerState {
    constructor(playerController, score, displayName) {
        super(playerController, score, displayName);
        this.stateId = possibleStates.WAIT_GAME_START;

        //There's no move to be made by player in this state.
        this.madeMove = true;
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

module.exports = WaitGameStartState;