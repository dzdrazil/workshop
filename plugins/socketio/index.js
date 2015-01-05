'use strict';

module.exports.register = function(server, options, next) {

  var io = require('socket.io')(server.listener);

  server.expose('io', io);

  next();
};

module.exports.register.attributes = {
  name: 'socketio'
};
