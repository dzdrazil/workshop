'use strict';

var stream = require('stream');

module.exports.register = function(server, options, next) {
	/**
	 * @class Pub
	 */
	var Pub = {
		/**
		 * SSE connections
		 * @type {Map}
		 */
		connections: new Map(),

		/**
		 * Send- sends an event down a connection
		 * @param  {String} name Event name
		 * @param  {Any} data JSONifiable data
		 */
		send: function(name, data) {
			if (Pub.has(name)) {
				Pub.get(name).forEach(function(connection) {
					connection.write('event: ' + name + '\n');
					connection.write('data: ' + JSON.stringify(data) + '\n\n');
					console.log('sent data: ', name, JSON.stringify(data));
				});
			}
		},

		/**
		 * Add a connection listener to a namespace
		 * @param {String} name       namespace
		 * @param {Stream} connection Node stream to pipe data into
		 */
		addConnection: function(name, connection) {
			if (!Pub.has(name)) {
				Pub.set(name, []);
			}
			Pub.get(name).push(connection);
		},

		/**
		 * Remove a connection and end it
		 * @param  {String} name       namespace
		 * @param  {Stream} connection Node streamn]
		 */
		removeConnection: function(name, connection) {
			var connections = Pub.get(name);
			var index = connections.indexOf(connection);
			if (index === -1) return;

			connections.splice(index, 1);
		},

		/**
		 * Test if a namespace exists
		 * @param  {String}  name namespace
		 * @return {Boolean}      True if the namespace already exists in the map
		 */
		has: function(name) {
			return Pub.connections.has(name);
		},

		/**
		 * Sets an object in the map- this is not meant to be used publicly
		 * @private
		 */
		set: function(name, data) {
			return Pub.connections.set(name, data);
		},

		/**
		 * Get a list of connections from the map
		 * @param  {String} name namespace
		 * @return {Array<Stream>} List of connections
		 */
		get: function(name) {
			return Pub.connections.get(name);
		}
	};

	server.expose('pub', Pub);

	/**
	 * @route ['GET'] /subscribe/{eventName} Get a stream of Server Sent events for the namespace
	 * @param  {String} eventName Namespace for the event stream
	 */
	server.route({
		method: 'GET',
		path: '/subscribe/{eventName}',
		config: {
			description: 'Subscription endpoint for server sent events',
			notes: 'Response contains a JWT token, which must be passed in the Authentication header',
			tags: ['api', 'sse'],
		},
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
