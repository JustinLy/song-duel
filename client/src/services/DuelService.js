import axios from 'axios';

let instance = null;
const server = axios.create({
    baseURL: 'http://localhost:3001'
});

class DuelService {
    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    createNewGame(endScore) {
        return server.get('/newGame').then((response) => {
            return response.data.gameId;
        }).catch((error) => {
            console.log('Failed to create game', error.message);
            throw error;
        });
    }
}

export default new DuelService();