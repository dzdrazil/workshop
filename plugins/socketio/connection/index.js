'use strict';

module.exports.register = function(server, options, next) {
  var sjwt = require('socketio-jwt');

  var io = server.plugins.socketio.io;

  io.on('connection', sjwt.authorize({
    secret: options.jwtKey,
    timeout: 15000 // 15 seconds to send the authentication message
  }))
    .on('authenticated', function(socket) {
      console.log('socket authenticated', socket.decoded_token);
    });

  return next();
};

module.exports.register.attributes = {
  name: 'socketio.connection'
};
