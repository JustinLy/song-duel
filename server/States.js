(function(exports){
   'use strict'
   
   exports.WAIT_GAME_START = "waitingForGameToStart";
   exports.WAIT_SONG= "waitAttack";
   exports.CHOOSE_SONG = "chooseSong";
   exports.DISPLAY_SONG_WAIT = "displaySongWait";
   exports.UPDATE_SCORE = "updateScore"
})(typeof exports === 'undefined'? this['states']={}: exports);