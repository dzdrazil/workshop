'use strict';

var _ = require('lodash');

module.exports.up = function(knex, Promise) {
  console.log('checking prerequisite extensions');

  return Promise.resolve()
  .then(function() {
    return knex.raw('SELECT * FROM pg_extension;')
    .then(function(extensions) {
      var ext = _.find(extensions.rows, function(extension) {
        return extension.extname === 'uuid-ossp';
      });

      if (!ext) {
        throw new Error(
          'postgres extension `uuid-ossp` required.' +
          '  Execute statement `CREATE EXTENSION "uuid-ossp";` in postgres to continue.'
        );
      }
    });
  });
};

module.exports.down = function(knex, Promise) {

};
