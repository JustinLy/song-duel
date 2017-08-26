const WaitGameStartState = require('Game/Player/WaitSongState.js');
const PlayerStates = require('States.js');
const SpotifyService = require('services/SpotifyService.js');
const Song = require('Song.js');
const Question = require('Question.js');
/**
 * Instance variables:
 * 
 * gameId - UUID for the game
 * 
 * playerMap - Map of (String playerId, PlayerState). 
 * 
 * endScore - score required to win the game
 * 
 * gameEmitter - shared EventEmitter used to send events to ServerController (and possibly others in future)
 */
class Game {
    constructor(gameId, numPlayers, endScore, gameEmitter) {
        this.gameId = gameId;
        this.numPlayers = numPlayers;
        this.endScore = endScore;
        this.gameEmitter = gameEmitter;
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

    /**
     * Given id of song selected by current selecting player, retrieve the selected song's info from
     * Spotify API and retrieve similar songs using recommendation API.
     * Then compile all the songs into a Question, and send this information to the player states updateState
     * method.
     * @param {String} songId 
     */
    onSongSelected(songId) {
        SpotifyService.getSong(songId).then((song) => {
            return SpotifyService.getRecommendedSongs(song, 3).then((recommendedSongs) => {
                //Save this as it will be needed to check player answers later.
                this.currentQuestion = new Question(recommendedSongs, song);
                
                let gameState = {
                        songOptions : this.currentQuestion.songOptions,
                        previewUrl : song.previewUrl
                }
                this._forEachPlayer((playerState) => {
                    playerState.updateState(gameState);
                });
            })
        })

    }

    /**
     * Check if the songId provided by the player is the correct answer to current question this.currentQuestion.
     * If correct, add playerId to this.answeredCorrectly set so once all players have answered correctly
     * this set can be used to determine which players should update their score.
     * Clear the this.answeredCorrectly set when player states get updated for next round.
     * 
     * Note: For now, this.answeredCorrectly is not technically necessary since we only have 1 player answeirng
     * at a time, but this is for the future when more than 2 players is supported.
     * @param {String} songId 
     * @param {String} playerId 
     */
    onAnswered(songId, playerId) {
        if (!this.answeredCorrectly) {
            this.answeredCorrectly = new Map();
        }

        //Record whether player answered correctly. If player wins, set gameWinner to player display name
        let gameWinner = null;
        if (this.currentQuestion.answerCorrect(songId)) {
            this.answeredCorrectly.set(playerId, true);
            gameWinner = this.playerMap.get(playerId).getScore() === endScore - 1 ? 
                this.playerMap.get(playerId).getDisplayName() : gameWinner;
        } else {
            this.answeredCorrectly.set(playerId, false);
        }

        //Every player except player who asked the question has answered, or a player won
        if (this.answeredCorrectly.size === numPlayers - 1 || gameWinner) {
            let gameState = {
                answeredCorrectly : this.answeredCorrectly,
                gameWinner : gameWinner
            };
            this._forEachPlayer((playerState) => {
                playerState.updateState(gameState);
            });

            //Clear answerdCorrecty map for next round since we're moving to next turn
            this.answeredCorrectly = null;

            if (gameWinner) {
                gameEmitter.emit("gameOver", {gameId : this.gameId});
            }
        }
    }
    
    destroy() {
        this.playerMap.forEach((id, state) => {
            state.destroy();
        });
        this.playerMap.clear();
        this.playerMap = null;

        this.gameEmitter = null;
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