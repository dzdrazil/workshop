'use strict';

var Joi = require('joi');

module.exports.register = function(server, options, next) {
	var pub = server.plugins.publish.pub;
	var db = server.plugins.db;

	var controller = require('./ProjectsController')(
		server,
		db,
		pub
	);

	var auth = require('./ProjectsAuthorization')();

	/**
	 * @route ['GET'] /projects/{?id} Get a list of projects for a user
	 * @param {String|undefined} id Workspace (user) UUID
	 */
	server.route({
		method: 'GET',
		path: '/projects/{id?}',
		config: {
			description: 'List projects for user',
			tags: ['api', 'projects'],
			pre: [
				auth.authorizeGetProjects
			],
			response: {
				schema: Joi.array().includes(Joi.object().keys({
					id: Joi.string().guid().description('Project ID'),
					name: Joi.string().description('User provided name'),
					owner_id: Joi.string().guid().description('User ID of the project\'s owner'),
					created_at: Joi.date().iso().description('Date the project was created'),
					updated_at: Joi.date().iso().description('Most recent modification date')
				}))
			}
		},
		handler: controller.getProjects
	});


	/**
	 * @route ['GET'] /projects/{?id}/subscribe Connect for SSEs- all current and future projects for the id
	 * @param {String} id Workspace (user) UUID
	 */
	server.route({
		method: 'GET',
		path: '/projects/{id}/subscribe',
		config: {
			description: 'List projects for user',
			tags: ['api', 'projects', 'sse'],
			pre: [
				auth.authorizeGetProjects
			]
		},
		handler: controller.subscribeToProjects
	});

	/**
	 * @route ['POST'] /projects/ Create a new project
	 * @param {String|undefined} id Project UUID
	 */
	server.route({
		method: 'POST',
		path: '/projects/',
		config: {
			description: 'Create a new project',
			tags: ['api', 'projects'],
			validate: {
				payload: {
					name: Joi.string().description('User provided name').required(),
					description: Joi.string().description('User provided description'),
					owner_id: Joi.string().guid().description('User ID of the project\'s owner'),
				}
			}
		},
		handler: controller.createProject
	});

	return next();
};


module.exports.register.attributes = {
	name: 'projects'
};
