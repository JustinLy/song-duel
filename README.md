Song Duel is a real-time multiplayer web game that allows players to challenge each other's 
knowledge of music. Two players join a game and take turns selecting a song from Spotify's vast collection of songs. A multiple-choice question is then generated containing the selected song and similar songs, while a 30-second preview of the song plays. The other player will then try to guess the song correctly for a point.
The first one to reach the set number of points wins.

# Playing the game

Visit https://song-duel.herokuapp.com to start playing the game!

Please note that this is a minimalistic first iteration, the game is still in development so there is more polishing, fixes, and features on the way. If you find any issues or have any feedback, don't hesitate to create an "Issue" on Github.

# FAQ

### How come there are certain songs that I can't search for in the game?

This is a current limitation of the Spotify API. Due to licensing restrictions, some songs do not have a 30-second preview available so those songs are not available for use in the game. 

For instance, Spotify does not provide any 30-second previews for songs by "The Rolling Stones".

# Contributing to Development

If you'd like to contribute to the develpment of this game, here's some basic onboarding instructions:

**Clone the repo**

`git clone https://github.com/JustinLy/song-duel.git`

**Install dependencies with NPM**

`cd song-duel`
`npm install`

`cd client`
`npm install`

**Run the server and client**
You can run the game server and client server at the same time. From the root directory of song-duel:

`npm run dev`

Once both servers have finished booting up, you should be able to open the game in the browser at:

`localhost:3000`

**Client code**

All client code can be found in the `song-duel/client` directory. This code is written with JavaScript (ES6), HTML, CSS, the React library, and the Socket.io library.

**Server code**

The server code can be found in the `song-duel/server` directory. This code is written with JavaScript (ES6), the Express framework, and the Socket.io library.

