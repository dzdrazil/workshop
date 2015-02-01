'use strict';

var Boom = require('boom');
var jwt = require('jsonwebtoken');

/**
 * @module AuthenticationController
 * @param  {Knex}         db        Database
 * @param  {ErrorsModule} errors    Custom application errors
 * @param  {Object}       options   Options passed to the authenticate plugin
 * @param  {String} options.jwtKey  Private key used to sign authentication tokens
 */
module.exports = function(server, db, errors, options) {
	/**
	 * @class AuthenticationController
	 */
	return {
		/**
		 * Validates a token, calling the callback function on completion
		 * @param  {Object}   decodedToken Decoded object
		 * @param  {Function} next         Callback- passed err, isValid, credentials as arguments
		 */
		validateToken: function(decodedToken, next) {
			next(null, true, {});
		},

		/**
		 * Login action
		 * @param  {Request} request Hapi request object
		 * @param  {Function} reply  Hapi reply function
		 */
		loginAction: function(request, reply) {
			db.User.authenticate(request.payload.email)
				.then(function(user) {
					console.log(user);
					if (!user) {
						throw new errors.AuthenticationError();
					}
					return db.User.createSession(user);
				})
				/* jshint camelcase:false */
				.then(function(session) {
					reply({
						userId: session.user_id,
						token: jwt.sign({sessionId: session.id, userId: session.user_id}, options.jwtKey)
					});
				})
				.catch(function(e) {
					if (e instanceof errors.AuthenticationError) {
						server.log(['error', 'authenticationFailure'], e.stack);
						return reply(Boom.unauthorized(e));
					}
					server.log(['error'], e.stack);
					reply(Boom.badImplementation(e.stack));
				});
		}
	};
};
