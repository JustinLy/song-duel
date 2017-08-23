const path = require('path');
rootPath = require('get-root-path').rootPath;
console.log(path.join(rootPath, 'server'));
require('app-module-path').addPath(path.join(rootPath, 'server'));

describe("test spotify service", function() {
    let SpotifyService = require("../../server/services/SpotifyService.js");
    it("test getSong", function(done) {
        SpotifyService.getSong("4pkFvX3AkuiSGPkv8gMlks").then(function(song) {
            expect(song.id).toBe("4pkFvX3AkuiSGPkv8gMlks");
            expect(song.name).toBe("Save Me");
            done();
        });
    });
})