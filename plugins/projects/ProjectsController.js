'use strict';

var Boom = require('boom');
var uuid = require('uuid');

module.exports = function(server, db, pub) {
	var ProjectTable = db.Project;
	/**
	 * @class  ProjectsController
	 */
	return {
		/**
		 * Handles the getProjectsRoute
		 * @param {Request} request               Hapi Request
		 * @param {Object}  request.params        Request params Object
		 * @param {String}  [request.params.id]   Optional User id for whom to get projects
		 * @param {String} request.auth.credentials.userId    If request.params.id is not provided, default to the authenticated user
		 * @param {Function} reply   Hapi reply
		 */
		getProjects: function(request, reply) {
			var userId = request.params.id;
			if (!userId) {
				userId = request.auth.credentials.userId;
			}

			return ProjectTable
				.getForUser(userId)
				.then(function(rows) {
					reply(rows);
				})
				.catch(reply);
		},

		/**
		 * Handles the getProjectsRoute
		 * @param {Request} request               Hapi Request
		 * @param {Object}  request.params        Request params Object
		 * @param {String}  [request.params.id]   Optional User id for whom to get projects
		 * @param {String} request.auth.credentials.userId    If request.params.id is not provided, default to the authenticated user
		 * @param {Function} reply   Hapi reply
		 */
		subscribeToProjects: function(request, reply) {
			var userId = request.params.id;
			if (!userId) {
				userId = request.auth.credentials.userId;
			}

			ProjectTable
				.getForUser(userId)
				.then(function(projects) {
						var name = 'workspace/' + userId;
						pub.createConnection(name, request, reply);
						projects.map(function(project) {
							pub.send(name, project);
						});
				})
				.catch(reply);
		},

		/**
		 * Handles the create project route
		 * @param {Request} request             Hapi request object
		 * @param {Object} request.auth         Authentication credentials
		 * @param {String} request.auth.credentials.userId  Currently logged in user id
		 * @param {Function} reply   Hapi reply
		 */
		createProject: function(request, reply) {
			if (!request.payload.ownerId) request.payload.ownerId = request.auth.credentials.userId;

			ProjectTable
				.create(
					request.payload.name,
					request.payload.description,
					request.payload.ownerId
				)
				.then(function(project) {
					reply();
					pub.send('workspace/' + request.auth.credentials.userId, project);
				})
				.catch(function(e) {
					server.log(['error'], e.stack);
					console.log(e.stack);
					reply(e);
				});
		},

		/**
		 * Handles the share workspace route
		 * @param {Request} request Hapi request     object
		 * @param {Object} request.payload HTTP       request body payload
		 * @param {String} request.payload.userId     User ID to share the project with
		 * @param {String} request.payload.projectId  Project ID to share
		 * @param {Function} reply   Hapi reply function
		 */
		shareProject: function(request, reply) {
			db.Project
				.shareWithUserModel(
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
