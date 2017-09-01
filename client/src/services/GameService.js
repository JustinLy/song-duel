import openSocket from 'socket.io-client';

let instance = null;
let socket = null;

/**
 * Encapsulates the socket used to communicate game events with
 * the backend. Components can just use these methods to send
 * and respond to events without worrying about socket details.
 */
class GameService {
    constructor() {
        if (!instance) {
            instance = this;
            socket = openSocket('http://localhost:3001');
        }
        return instance;
    }

    sendEvent(event, data) {
        socket.emit(event, data);
    }

    onEvent(event, callback) {
        socket.on(event, callback);
    }
}

export default new GameService();