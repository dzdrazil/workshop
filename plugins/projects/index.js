'use strict';

module.exports.register = function(server, options, next) {
	var pub = server.plugins.publish.pub;
	var db = server.plugins.db;

	var controller = require('./ProjectsController')(
		server,
		db,
		pub
	);

	/**
	 * @route ['GET'] /projects/{?id} Get a list of projects for a user
	 * @param {String|undefined} id Project UUID
	 */
	server.route({
		method: 'GET',
		path: '/projects/{?id}',
		config: {
			description: 'List projects for user',
			tags: ['api', 'projects'],
		},
		handler: controller.getProjects
	});

	return next();
};


module.exports.register.attributes = {
	name: 'projects'
};
