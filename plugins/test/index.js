'use strict';

module.exports.register = function(server, options, next) {
	var pub = server.plugins.publish.pub;

	server.route({
		method: 'GET',
		path: '/test',
		config: {
			description: 'test endpoint',
			tags: ['api', 'test'],
		},
		handler: function(request, reply) {
			pub.send('test', 't1');

			reply({success: true});
		}
		//,
		// config: {
		//   validate: {
		//     payload: {
		//       email: Joi.string().email().required()
		//     }
		//   },
		//   response: {
		//     schema: Joi.object().keys({
		//       userId: Joi.string(),
		//       token: Joi.string()
		//     })
		//   }
		//}
	});

	return next();
};


module.exports.register.attributes = {
	name: 'test'
};
