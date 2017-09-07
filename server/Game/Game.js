const WaitGameStartState = require('Game/Player/WaitGameStartState.js');
const GameEvents = require('events/GameEvents.js');
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
        this.playerMap.set(playerId, playerState);

        //Notify all players that a new player joined and pass map of <displayName, score>.
        let scoreMap = this._getScoreMap();
        this.gameEmitter.emit("gameEvent", {
            eventId: GameEvents.NEW_PLAYER,
            gameId: this.gameId,
            eventData: {
                scoreMap: scoreMap
            }
        });

        if (this._allPlayersReady()) {
            console.log(this.gameId + " has Got enough players, let's start");
            this._startGame();
        }

    }

    /**
     * Given id of song selected by current selecting player, retrieve the selected song's info from
     * Spotify API and retrieve similar songs using recommendation API.
     * Then compile all the songs into a Question, and send this information to the player states updateState
     * method.
     * @param {String} songId 
     */
    onSongSelected(songId, playerId) {
        this.playerMap.get(playerId).makeMove();

        SpotifyService.getSong(songId).then((song) => {
            return SpotifyService.getRecommendedSongs(song, 3).then((recommendedSongs) => {
                //Save this as it will be needed to check player answers later.
                this.currentQuestion = new Question(recommendedSongs, song);

                let gameState = {
                    question: {
                        songOptions: this.currentQuestion.songOptions,
                        previewUrl: song.previewUrl
                    }
                }
                this.playerMap.forEach((playerState, id) => {
                    this.playerMap.set(id, playerState.updateState(gameState));
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
        let answeringPlayer = this.playerMap.get(playerId);
        answeringPlayer.makeMove();

        //If another player beat this one to it, we do nothing.
        if (!this.currentQuestion.isAnswered) {
            let isCorrect = this.currentQuestion.checkAnswer(songId)
            if (isCorrect) {
                answeringPlayer.addPoint();
            }

            //Broadcast this player's answer to all other players to see
            this.gameEmitter.emit("gameEvent", {
                eventId: GameEvents.NEW_ANSWER,
                gameId: this.gameId,
                eventData: {
                    displayName: answeringPlayer.displayName,
                    answerSongId: songId,
                    isCorrect: isCorrect
                }
            });

            //Update all player states to move the game forward
            if (isCorrect || this._allPlayerMovesMade()) {
                //Create map of <Display name, score> 
                let scoreMap = this._getScoreMap();

                let gameState = {
                    scoreMap: scoreMap,
                    correctSong: this.currentQuestion.correctSong
                }

                this.playerMap.forEach((playerState, id) => {
                    this.playerMap.set(id, playerState.updateState(gameState));
                });
            }
        }
    }

    /**
     * Player is ready for next round. Check if all players are ready
     * , check if a player has won, determine next player to choose song,
     * and then update player states.
     * @param {*String} playerId 
     */
    onReadyForNextRound(playerId) {
        this.playerMap.get(playerId).makeMove();

        if (this._allPlayerMovesMade()) {
            //Check if a player has won
            let winner = null;
            for (playerState of this.playerMap.values()) {
                if (playerState.score === this.endScore) {
                    winner = playerState.displayName
                    break;
                }
            }

            if (winner) {
                gameEmitter.emit("gameover", {
                    eventId: GameEvents.PLAYER_WON,
                    gameId: this.gameId,
                    eventData: {
                        winner: winner
                    }
                });
            } else {
                //Set next player to choose a song
                this.indexOfChooser = (this.indexOfChooser + 1) % this.numPlayers;

                let index = 0;
                this.playerMap.forEach((playerState, id) => {
                    this.playerMap.set(id, playerState.updateState({
                        isChoosingSong: index === this.indexOfChooser
                    }));
                    index++;
                });
            }
        }
    }

    search(query) {
        return SpotifyService.search(query);
    }

    destroy() {
        this.playerMap.forEach((state, id) => {
            state.destroy();
        });
        this.playerMap.clear();
        this.playerMap = null;

        this.gameEmitter = null;
    }

    _getScoreMap() {
        let scoreMap = [];
        this.playerMap.forEach((playerState, id) => {
            scoreMap.push({
                displayName: playerState.displayName,
                score: playerState.score
            });
        });
        return scoreMap;
    }

    _startGame() {
        //Pick a random player to be the first to choose a song. All others will wait to answer.
        this.indexOfChooser = Math.floor(this.numPlayers * Math.random());

        let index = 0;
        this.playerMap.forEach((playerState, id) => {
            this.playerMap.set(id, playerState.updateState({
                isChoosingSong: index === this.indexOfChooser
            }));
            index++;
        });
    }

    /**
     * Check if all players have made their move for current state.
     * This is a helper to determine if we can update all player states
     * or if we're still waiting on input from some players.
     */
    _allPlayerMovesMade() {
        for (state of this.playerMap.values()) {
            if (!state.hasMadeMove()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Helper to check if there are enough players to start and all players are in a ready state.
     */
    _allPlayersReady() {
        if (this.playerMap.size != this.numPlayers) {
            return false;
        }

        return Array.from(this.playerMap.values()).every(playerState => {
            return playerState.stateId === GameEvents.WAIT_GAME_START;
        });
    }

}

module.exports = Game;