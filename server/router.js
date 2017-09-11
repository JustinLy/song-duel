'use strict';
module.exports = function (app) {
  const serverController = require('controllers/ServerController.js');
  const path = require('path');

  app.route('/newGame')
    .get(serverController.newGame);

  app.route('/joinGame/:gameId')
    .get(serverController.joinGame);

  //used to serve static client on the production server.
  app.route
    .get('*', function (request, response) {
      response.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
    });
}

