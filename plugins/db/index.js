'use strict';

var knex = require('knex');

module.exports.register = function(server, options, next) {
	var db = knex({
		dialect: 'pg',
		connection: {
			host     : options.knex.connection.host,
			user     : options.knex.connection.user,
			password : options.knex.connection.password,
			database : options.knex.connection.database
		}
	});

	db.AUTO_UUID = db.raw('uuid_generate_v4()');

	server.expose('connection', db);

	var externals = {
		User: require('./models/User')(db),
		Session: require('./models/Session')(server, db),
		Project: require('./models/Project')(db)
	};

	server.expose(externals);

	next();
};

module.exports.register.attributes = {
	name: 'db'
};
