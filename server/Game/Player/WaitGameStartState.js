
class WaitGameStartState extends PlayerState {
    constructor(playerController, score, displayName) {
        super(playerController, score);
        this.stateId = possibleStates.WAIT_GAME_START;
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