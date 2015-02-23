'use strict';

var USER_TABLENAME = 'users';
var SESSION_TABLENAME = 'sessions';

module.exports = function(knex) {
	/**
	 * @class User
	 */
	return {
		/**
		 * Find a user row
		 * @param  {String} id User UUID
		 * @return {Object}    user database row
		 */
		find: function(id) {
			return knex(USER_TABLENAME)
				.first('*')
				.where({id: id});
		},
		/**
		 * Get the UUID for the User based on the credentials
		 * @param  {String} email Email address
		 * @return {Promise}       Resolves to the user's UUID
		 */
		authenticate: function(email) {
			return knex.first('id')
				.from(USER_TABLENAME)
				.where({email: email});
		},

		/**
		 * Create a session for the JWT token
		 * @param  {User} userRow User database row
		 * @return {Promise}         Resolves to a hash of (session)id and user_id
		 */
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
							user_id: userRow.id,
							created_at: new Date(),
							updated_at: new Date()
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
