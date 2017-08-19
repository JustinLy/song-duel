'use strict';
module.exports = function(app) {
  const serverController = require('controllers/ServerController.js');
  
  app.route('/newGame')
    .get(serverController.newGame);

  app.route('/joinGame/:gameId')
    .get(serverController.joinGame);
}
