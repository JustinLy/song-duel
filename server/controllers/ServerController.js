'use strict'

const uuidv4 = require('uuid/v4');
const Game = require('Game/Game.js');
const PlayerController = require('controllers/PlayerController.js');
const EventEmitter = require('events').EventEmitter;
const PlayerEvents = require('events/PlayerEvents.js');

let gameMap = null;
let gameEmitter = null;
let io = null;
/**
 * Get server ready to listen to incoming socket connections (players joining games)
 */
exports.init = function (socketIo) {
    io = socketIo;
    gameMap = new Map();
    gameEmitter = new EventEmitter();

    //Destroy game if it has ended.
    gameEmitter.on('gameOver', (data) => {
        //Broadcast the gameover event to players. eventId will be the reason why game ended
        io.sockets.in(data.gameId).emit(data.eventId, data.eventData);

        let currentGame = data.gameId ? this.gameMap.get(data.gameId) : null;
        if (currentGame) {
            currentGame.destroy();
            this.gameMap.delete(gameId);
        }
    });

    //Used to broadcast events from a Game instance to all its players
    gameEmitter.on('gameEvent', (data) => {
        io.sockets.in(data.gameId).emit(data.eventId, data.eventData);
    });

    io.on('connection', function (socket) {
        console.log('a user connected to the server');

        //New player joins a game
        socket.on(PlayerEvents.JOIN, function (data) {
            console.log('user joined ' + data.gameId);
            let joinedGame = gameMap.get(data.gameId);

            //Generate new player ID for player
            const playerId = uuidv4();

            //Attach game and player info to socket and add it to room
            socket.gameId = data.gameId;
            socket.playerId = playerId;
            socket.join(data.gameId);

            let playerController = new PlayerController(socket, joinedGame);
            joinedGame.addPlayer(playerController, data.displayName, playerId);
        });

        socket.on('disconect', function (data) {
            //TODO: Check if game player belonged to is now empty and delete it if so
        });
    });
}

/**
 * Generate new game id and game instance, add to gameMap.
 * Generate player ids. Send gameId, playerId and a join URL to the user who initiated the new game.
 * Note: The user isn't added to the game yet at this point, the client must initiate a socket connection
 * and join event with gameId and playerId they receive. A player isn't considered to be
 * "in a game" until they've conected via a socket.
 */
exports.newGame = function (request, response) {
    let numPlayers = 2; //Change this to a variable passed in request if you decide to support more players.
    const gameId = uuidv4();
    gameMap.set(gameId, new Game(gameId, numPlayers, request.params.endScore, gameEmitter));

    console.log("made a new game id: " + gameId);
    response.send({
        "gameId": gameId,
        "joinUrl": request.protocol + '://' + request.get('host') + '/joinGame/' + gameId
    });
}

/**
 * Checks to see if game the user wants to join exists and generates them a new playerId and
 * returns the gameId. The client must still initiate a socket connection and join with
 * the given gameId and playerId to actually join the game, similar to newGame.
 */
exports.joinGame = function (request, response) {
    let gameId = request.params.gameId;
    let game = gameMap.get(gameId);
    if (!game) {
        response.status(404).send("Game not found");
    }

    //Create new player id
    const playerId = uuidv4();
    console.log("Found game: " + gameId);
    console.log("made new player id: " + playerId);

    response.send({
        "gameId": gameId,
        "playerId": playerId
    });
}