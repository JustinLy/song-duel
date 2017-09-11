require('app-module-path').addPath(__dirname);
const express = require('express');

let app = express();
const cors = require('cors');
app.use(cors());

app.set('port', (process.env.PORT || 3001));
// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

let http = require('http').Server(app);
let io = require('socket.io')(http);


let serverController = require('controllers/ServerController.js');
serverController.init(io);

let routes = require('router.js');
routes(app);

http.listen(app.get('port'), function () {
    console.log("Server started");
});