'use strict';

var stream = require('stream');
var Map = require('es6-map');

module.exports.register = function(server, options, next) {
  var Pub = {
    connections: new Map(),
    send: function(name, data) {
      if (Pub.has(name)) {
        Pub.get(name).forEach(function(connection) {
          connection.write('event: ' + name + '\n');
          connection.write('data: ' + JSON.stringify(data) + '\n\n');
          console.log('sent data: ', name, JSON.stringify(data));
        });
      }
    },
    addConnection: function(name, connection) {
      if (!Pub.has(name)) {
        Pub.set(name, []);
      }
      Pub.get(name).push(connection);
    },
    removeConnection: function(name, connection) {
      var connections = Pub.get(name);
      var index = connections.indexOf(connection);
      if (index === -1) return;

      connections.splice(index, 1);
    },
    has: function(name) {
      return Pub.connections.has(name);
    },
    set: function(name, data) {
      return Pub.connections.set(name, data);
    },
    get: function(name) {
      return Pub.connections.get(name);
    }
  };

  server.expose('pub', Pub);

  server.route({
    method: 'GET',
    path: '/subscribe/{eventName}',
    handler: function(request, reply) {
      var channel = new stream.PassThrough();
      var eventName = request.params.eventName;

      Pub.addConnection(eventName, channel);

      request.raw.req.on('close', function() {
        Pub.removeConnection(eventName, channel);
      });

      reply(channel)
        .code(200)
        .type('text/event-stream')
        .header('Connection', 'keep-alive')
        .header('Cache-Control', 'no-cache')
        .header('retry', 10000);
    }
  });

  return next();
};


module.exports.register.attributes = {
  name: 'publish'
};
