import axios from 'axios';

let instance = null;
const server = axios.create();

class DuelService {
    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    createNewGame(endScore) {
        return server.get(`/asdf`, {
            params: {
                endScore: endScore
            }
        }).then((response) => {
            return response.data.gameId;
        }).catch((error) => {
            console.log('Failed to create game', error.message);
            throw error;
        });
    }
}

export default new DuelService();