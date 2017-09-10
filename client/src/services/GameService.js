import io from 'socket.io-client';

let instance = null;
let socket = null;
let connected = false;
/**
 * Encapsulates the socket used to communicate game events with
 * the backend. Components can just use these methods to send
 * and respond to events without worrying about socket details.
 */
class GameService {
    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    _connect() {
        socket = io();
        connected = true;
    }

    sendEvent(event, data) {
        if (!connected) {
            this._connect();
        }
        socket.emit(event, data);
    }

    onEvent(event, callback) {
        if (!connected) {
            this._connect();
        }
        socket.on(event, callback);
    }

    shutdown() {
        if (connected && socket) {
            socket.close();
            connected = false;
        }
    }
}

export default new GameService();