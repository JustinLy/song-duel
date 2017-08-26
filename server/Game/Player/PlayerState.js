let possibleStates = require("States.js");

class PlayerState {
    constructor(playerController, score, displayName) {
        this.playerController = playerController;
        this.score = score;
        this.displayName = displayName;
    }

    get possibleStates() {
        return possibleStates;
    }

    get displayName() {
        return this.displayName;
    }

    get score() {
        return this.score;
    }

    updateState(gameData) {
        //TODO: do stuff with gameData, format, extract, whatever
        //TODO: instantiate new state
        //TODO: send update to playerController of new state
        throw new Error("Child state must implement this method");
    }

    destroy() {
        this.playerController.destroy();
        this.playerController = null;
    }
}

module.exports = PlayerState;