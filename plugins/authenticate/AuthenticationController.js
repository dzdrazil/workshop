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
	var UserTable = db.User;
	var SessionTable = db.Session;

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
			SessionTable.validateSession(decodedToken.userId,decodedToken.sessionId)
				.then(function(isValid) {
					next(null, isValid, decodedToken);
				})
				.catch(function(e) {
					next(e, false);
				});
		},

		/**
		 * Login action
		 * @param  {Request} request Hapi request object
		 * @param  {Function} reply  Hapi reply function
		 */
		loginAction: function(request, reply) {
			UserTable.authenticate(request.payload.email)
				.tap(function(user) {
					if (!user)
						throw new Boom.unauthorized('invalid credentials');
				})
				.then(function(userRow) {
					return SessionTable.findOrCreate(userRow.id);
				})
				.then(function(session) {
					reply({
						userId: session.user_id,
						token: jwt.sign({sessionId: session.id, userId: session.user_id}, options.jwtKey)
					});
				})
				.catch(function(e) {
					server.log(['error'], e.stack);
					reply(e);
				});
		}
	};
};
