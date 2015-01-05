'use strict';

var knex = require('knex');

module.exports.register = function(server, options, next) {
  var db = knex({
    dialect: 'pg',
    connection: {
      host     : options.connection.host,
      user     : options.connection.user,
      password : options.connection.password,
      database : options.connection.database
    }
  });

  db.AUTO_UUID = db.raw('uuid_generate_v4()');

  server.expose('connection', db);

  var externals = {
    User: require('./models/User')(db),
    Project: require('./models/Project')(db)
  };

  server.expose(externals);

  next();
};

module.exports.register.attributes = {
  name: 'db'
};
