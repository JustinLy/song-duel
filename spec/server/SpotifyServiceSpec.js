
const path = require('path');
rootPath = require('get-root-path').rootPath;
console.log(path.join(rootPath, 'server'));
require('app-module-path').addPath(path.join(rootPath, 'server'));

let testSongOneArtist = require('./assets/test_song_1.json');
let testSongTwoArtists = require('./assets/test_song_2.json');

describe("test spotify service", function() {
    let SpotifyService = require("services/SpotifyService.js");
    it("test getSong", function(done) {
        SpotifyService.getSong("4pkFvX3AkuiSGPkv8gMlks").then(function(song) {
            expect(song.id).toEqual("4pkFvX3AkuiSGPkv8gMlks");
            expect(song.name).toEqual("Save Me");
            done();
        });
    });

    it("test getRecommendations one artist", function(done) {
        SpotifyService.getRecommendedSongs(testSongOneArtist, 3).then((songs) => {
            expect(songs.length).toEqual(3);
            done();
        });
    });

    it("test getRecommendations two artists", function(done) {
        SpotifyService.getRecommendedSongs(testSongTwoArtists, 3).then((songs) => {
            expect(songs.length).toEqual(3);
            done();
        });
    });
})