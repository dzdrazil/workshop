'use strict';

module.exports.register = function(server, options, next) {

	server.expose({
		AuthenticationError: require('./customTypes/AuthenticationError'),
		BadImplementationError: require('./customTypes/BadImplementationError')
	});

	next();
};

module.exports.register.attributes = {
	name: 'errors'
};
