'use strict';

var USER_TABLENAME = 'users';
var SESSION_TABLENAME = 'sessions';

module.exports = function (knex) {
  return {
    authenticate: function(email) {
      return knex.first('id')
        .from(USER_TABLENAME)
        .where({email: email});
    },

    createSession: function(userRow) {
      /* jshint camelcase:false */
      return knex.first('id', 'user_id')
        .from(SESSION_TABLENAME)
        .where({user_id: userRow.id})
        .then(function(row) {
          if (row) {
            return row;
          }
          return knex
            .insert({
              id: knex.AUTO_UUID,
              user_id: userRow.id
            })
            .into(SESSION_TABLENAME)
            .returning('id')
            .then(function(id) {
              return {
                id: id,
                user_id: userRow.id
              };
            });
        });
    }
  };
};
