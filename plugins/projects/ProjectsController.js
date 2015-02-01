'use strict';

var Boom = require('boom');

module.exports = function(server, db, pub) {
	/**
	 * @class  ProjectsController
	 */
	return {
		/**
		 * Handles the getProjectsRoute
		 * @param  {Request} request Hapi Request
		 * @param  {Function} reply   Hapi reply
		 */
		getProjects: function(request, reply) {
			var userId = request.query.id;
			if (!userId) {
				userId = request.auth.userId;
			}

			db.Project.getForUser(userId)
				.complete(reply);
		},

		/**
		 * Handles the create project route
		 * @param  {Request} request Hapi request object
		 * @param  {Function} reply   Hapi reply]
		 */
		createProject: function(request, reply) {
			db.Project.create(request)
				.then(function(project) {
					reply();
					pub.send('workspace/' + request.auth.userId, project);
				})
				.catch(function(e) {
					server.log(['error', 'db'], e.stack);
					reply(Boom.badImplementation(e));
				});
		},

		/**
		 * Handles the share workspace route
		 * @param  {Request} request Hapi request object
		 * @param  {Function} reply   Hapi reply function
		 */
		shareWorkspace: function(request, reply) {
			db.Project
				.shareWithUser(
					request.payload.userId,
					request.payload.projectId
				)
				.then(function() {
					return db.Project.find(request.payload.projectId);
				})
				.then(function(project) {
					pub.send('workspace/' + request.payload.userId, project);
					reply();
				})
				.catch(function(e) {
					server.log(['error', 'db'], e.stack);
					reply(Boom.badImplementation(e));
				});
		}
	};
};
