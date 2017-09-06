const possibleStates = require("events/GameEvents.js");

class PlayerState {
    constructor(playerController, score, displayName) {
        this.playerController = playerController;
        this.score = score;
        this.displayName = displayName;

        //Determines whether player has made their move for current state. 
        //This is used by the Game to determine when it can update everyone's state
        this.madeMove = false;
    }

    // get possibleStates() {
    //     return possibleStates;
    // }

    // get displayName() {
    //     return this.displayName;
    // }

    // get score() {
    //     return this.score;
    // }

    addPoint() {
        this.score++;
    }

    makeMove() {
        this.madeMove = true;
    }

    hasMadeMove() {
        return this.madeMove;
    }

    updateState(gameData) {
        throw new Error("Child state must implement this method");
    }

    destroy() {
        this.playerController.destroy();
        this.playerController = null;
    }
}

module.exports = PlayerState;