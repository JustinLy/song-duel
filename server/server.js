require('app-module-path').addPath(__dirname);

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let routes = require('router.js');
routes(app);


http.listen(3000, function() {
    console.log("Server started");
});