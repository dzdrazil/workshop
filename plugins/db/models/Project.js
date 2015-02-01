'use strict';

module.exports = function(db) {
	/* jshint camelcase:false */
	/**
	 * @class Project
	 */
	return {
		/**
		 * Create a new Project
		 * @param  {String} name    Project name
		 * @param  {String} ownerId Project Owner UUID
		 * @return {Promise}        Resolves to the new Project model
		 */
		create: function(name, ownerId) {
			return db.insert({
				id: db.AUTO_UUID,
				name: name,
				owner_id: ownerId
			}, 'id')
				.into('projects')
				.then(function(result) {
					return result[0];
				});
		},

		/**
		 * Get projects the user has access to
		 * @param  {String} userId User UUID
		 * @return {Promise}        Resolves to an array of projects
		 */
		getForUser: function(userId) {
			return db.select('projects.*')
				.from('projects')
				.leftJoin('users_projects', 'users_projects.project_id', 'projects.id')
				.where('users_projects.user_id', userId)
				.orWhere('projects.owner_id', userId);
		},

		/**
		 * Adds an association between the specified project and user
		 * @param  {String} userId     User UUID
		 * @param  {String} projectId  Project UUID
		 * @param  {Object} connection Optional connection (in case a transaction connection is needed)
		 * @return {Promise}           Result of the DB operation
		 */
		shareWithUser: function(userId, projectId, connection) {
			return (connection || db).insert({
				user_id: userId,
				project_id: projectId
			})
			.into('users_projects');
		},

		/**
		 * Changes the owner of the project
		 * @param  {String} projectId  Project UUID
		 * @param  {String} newOwnerId New Owner (User) UUID
		 * @return {Promise}            Result of the DB operation
		 */
		changeOwner: function(projectId, newOwnerId) {
			var self = this;
			return db.transaction(function(t) {
				return t.first('owner_id')
					.from('projects')
					.where('id', projectId)
					.then(function(projectRow) {
						return self.shareWithUser(projectRow.owner_id, projectId, t);
					})
					.then(function() {
						return t('projects')
							.update('owner_id', newOwnerId)
							.where('id', projectId);
					});
			});

		}
	};
};
