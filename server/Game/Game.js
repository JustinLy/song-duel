WaitGameStartState = require('Game/Player/WaitSongState.js');
PlayerStates = require('States.js');
/**
 * Instance variables:
 * 
 * gameId - UUID for the game
 * 
 * playerMap - Map of (String playerId, PlayerState). 
 */
class Game {
    constructor(gameId, numPlayers) {
        this.gameId = gameId;
        this.numPlayers = numPlayers;
        this.playerMap = new Map();
    }

    /**
     * Add new player to this game.
     * Create a new PlayerState instance for the player and bind the given PlayerController to it.
     * Notify all players that a player joined and send them the updated player list.
     * @param {PlayerController} playerController 
     * @param {String} displayName 
     * @param {UUID} playerId 
     */
    addPlayer(playerController, displayName, playerId) {
        let playerState = new WaitGameStartState(playerController, 0, displayName);
        this.playerMap.put(playerId, playerState);

        //Notify all players that a new player joined and pass updated player list.
        let playersList = Array.from(this.playerMap.values(), state => state.displayName);
        playerController.notifyPlayerJoined(playersList);

        if (_allPlayersReady()) {
            console.log("Got enough players, let's start");
            _startGame();
        }
        
    }

    onSongSelected(songId) {
        //call spotify service to get preview, song name, etc (or maybe frontned gives it?)
        //call spotify service to get 4 related song ids and names
        //package the preview and 4 related songs into data object
    }

    _startGame() {
        //Pick a random player to be the first to choose a song. All others will wait to answer.
        let indexOfChooser = this.numPlayers * Math.random() + 1;

        this._forEachPlayer((playerState, index) => {
            if (index == indexOfChooser) console.log(playerState.playerId + " is attacking first");
            playerState.updateState({
                isChoosingSong : index === indexOfChooser
            });
        });
    }

    /**
     * Helper to call a function on each player state.
     * @param  action - a callback function to call on each player state
     */
    _forEachPlayer(action) {
        Array.from(this.playerMap.values()).forEach(action);
    }
    /**
     * Helper to check if there are enough players to start and all players are in a ready state.
     */
    _allPlayersReady() {
        if (this.playerMap.size != this.numPlayers) {
            return false;
        }

        return Array.from(this.playerMap.values()).every(playerState => {
            return playerState.stateId === PlayerStates.WAIT_GAME_START;
        });
    }

}

module.exports = Game;