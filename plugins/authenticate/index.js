'use strict';

var Joi = require('joi');

module.exports.register = function(server, options, next) {

	/**
	 * @type {AuthenticationController}
	 */
	var controller = require('./AuthenticationController')(
		server,
		server.plugins.db,
		server.plugins.errors,
		options
	);

	server.register(require('hapi-auth-jwt'), function(err) {
		if (err) throw err;

		server.auth.strategy('token', 'jwt', 'required', {
			key: options.jwtKey,
			validateFunc: controller.validateToken,
			allowQueryToken: true,
			queryTokenParamName: 'access_token'
		});
	});

	/**
	 * @route ['POST'] /login User login endpoint
	 * @param {String} email User email credential
	 */
	server.route({
		method: 'POST',
		path: '/login',
		handler: controller.loginAction,
		config: {
			description: 'User login endpoint',
			notes: 'Response contains a JWT token, which must be passed in the Authentication header',
			tags: ['api', 'user'],
			auth: false,
			validate: {
				payload: {
					email: Joi.string().email().required()
				}
			},
			response: {
				schema: Joi.object().keys({
					userId: Joi.string(),
					token: Joi.string()
				})
			}
		}
	});

	return next();
};

module.exports.register.attributes = {
	name: 'authenticate'
};
