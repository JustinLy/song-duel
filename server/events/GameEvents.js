(function (exports) {
    'use strict'

    exports.WAIT_GAME_START = "waitingForGameToStart";
    exports.WAIT_SONG = "waitForSong";
    exports.CHOOSE_SONG = "chooseSong";
    exports.DISPLAY_SONG_WAIT = "displaySongWait";
    exports.DISPLAY_SONG_ANSWER = "displaySongAnswer";
    exports.UPDATE_SCORE = "updateScore";
    exports.NEW_PLAYER = "playerJoined";
    exports.NEW_ANSWER = "newAnswer";
    exports.PLAYER_WON = "playerWon";
    exports.PLAYER_DISCONNECTED = "playerDisconnected";
    exports.SEARCH_RESULTS = "searchResults";
})(typeof exports === 'undefined' ? this['GameEvents'] = {} : exports);