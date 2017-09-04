import GameEvents from "../common/GameEvents.js";

let instance = null;
let turnDescriptions;
class TurnDescriptions {
    constructor() {
        if (!instance) {
            instance = this;
            turnDescriptions = new Map();
            this._constructDesecriptionMap();
        }
        return instance;
    }

    getDescription(eventName) {
        return turnDescriptions.get(eventName);
    }

    _constructDesecriptionMap() {
        turnDescriptions.set(GameEvents.CHOOSE_SONG, "Send a song to your opponents");
        turnDescriptions.set(GameEvents.DISPLAY_SONG_WAIT, "Waiting for opponents to answer");
        turnDescriptions.set(GameEvents.WAIT_GAME_START, "Waiting for more players to join");
        turnDescriptions.set(GameEvents.DISPLAY_SONG_ANSWER, "Choose the correct song");
        turnDescriptions.set(GameEvents.WAIT_SONG, "Waiting for opponent to choose a song");
    }
}

export default new TurnDescriptions();