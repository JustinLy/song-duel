
(function(exports){
'use strict'

    // your code goes here

   exports = {
       WAIT_GAME_START : "waitingForGameToStart",
       WAIT_SONG : "waitAttack",
       CHOOSE_SONG : "chooseSong",
       DISPLAY_SONG_WAIT : "displaySongWait",
       DISPLAY_SONG_ANSWER : "displaySongAnswer",
       UPDATE_SCORE : "updateScore"
   }

})(typeof exports === 'undefined'? this['states']={}: exports);