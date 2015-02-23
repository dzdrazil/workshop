'use strict';

var SESSION_TABLENAME = 'sessions';

module.exports = function(server, db) {
	/**
	 * @class Session
	 */
	return {
		/**
		 * Validate that a session exists for the given user and session id
		 * @param  {String} userId    User UUID
		 * @param  {String} sessionId Session UUID
		 * @return {Boolean}          Whether or not the session is valid
		 */
		validateSession: function(userId, sessionId) {
			return db.first('id')
				.from(SESSION_TABLENAME)
				.where({id: sessionId, user_id: userId})
				.then(function(row) {
					if (row) return true;
					return false;
				});
		},

		/**
		 * Finds or creates a session for a user id
		 * @param  {String} userId User UUID
		 * @return {Object}        a pair of id, user_id
		 */
		findOrCreate: function(userId) {
			return db.first('*')
				.from(SESSION_TABLENAME)
				.where({user_id: userId})
				.then(function(row) {
					if (row) return row;

					return db(SESSION_TABLENAME)
						.returning('id')
						.insert({id: db.AUTO_UUID, user_id: userId})
						.then(function(id) {
							return {
								id: id,
								user_id: userId
							};
						})
						.catch(function(e) {
							server.log(['error'], e);
							throw e;
						});
				});
		}
	};
};
