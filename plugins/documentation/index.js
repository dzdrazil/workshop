'use strict';

module.exports.register = function(server, options, next) {
	/**
	 * @route [GET] /documentation Hapi swagger documentation route
	 */
	server.register({
		register: require('hapi-swagger'),
		options: {
			basePath: options.basePath,
			apiVersion: server.version,
			enableDocumentationPage: options.enable,
			payloadType: 'form'
		}
	}, function(err) {
		if (err) throw err;

		server.log(['start'], 'hapi swagger started at ', options.basePath);
		next();
	});
};

module.exports.register.attributes = {
	name: 'documentation'
};
