const shuffle = require('shuffle-array');

/*
Main purpose of this class is to take a song and its similar songs
and represent a question with all these songs as options.
It also encapsulates the correct song info and exposes a method
to check guesses against the correct song.
*/
class Question {
    constructor(similarSongs, correctSong) {
        let songOptions = [].concat(similarSongs);
        songOptions.push(correctSong);
        //Shuffle order so there's no pattern to which option is correct.
        shuffle(songOptions);
        this.songOptions = songOptions;

        this.correctSong = correctSong;
    }

    checkAnswer(answerSongId) {
        return answerSongId === correctSong.id;
    }
}

module.exports = Question;