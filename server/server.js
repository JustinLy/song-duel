require('app-module-path').addPath(__dirname);

let app = require('express')();
const cors = require('cors');
app.use(cors());

let http = require('http').Server(app);
let io = require('socket.io')(http);


let serverController = require('controllers/ServerController.js');
serverController.init(io);

let routes = require('router.js');
routes(app);


http.listen(3001, function () {
    console.log("Server started");
});