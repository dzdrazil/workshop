'use strict';

var Boom = require('boom');

module.exports = function() {
	/**
	 * @module ProjectsAuthorization
	 */
	return {
		/**
		 * Ensures that the id (if provided) matches the logged in userId
		 * @param  {Request} request Hapi request object
		 * @param  {Function} next  Hapi continuation function
		 */
		authorizeGetProjects: function(request, next) {
			if (request.params.id &&
				request.params.id !== request.auth.credentials.userId) return next(Boom.forbidden());

			next();
		}
	};
};
