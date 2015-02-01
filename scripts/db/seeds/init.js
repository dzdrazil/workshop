'use strict';

module.exports.seed = function(knex, Promise) {
  console.log('running seed init');
  return Promise.resolve()
    .then(function() {
      return knex
      /* jshint camelcase:false */
      .insert([
        {
          id: knex.raw('uuid_generate_v4()'),
          first_name: 'Dan',
          last_name: 'Zdrazil',
          email: 'dzdrazil@nerdery.com'
        },
        {
          id: knex.raw('uuid_generate_v4()'),
          first_name: 'Eddie',
          last_name: 'Pfremmer',
          email: 'epfremm@nerdery.com'
        }
      ], 'id')
      .into('users');
    })
    .then(function(result) {
      return result;
    })
    .catch(function(e) {
      console.log(e);
    });
};
