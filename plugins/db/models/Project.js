'use strict';

module.exports = function(db) {
  /* jshint camelcase:false */
  return {
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

    getForUser: function(userId) {
      return db.select('projects.*')
        .from('projects')
        .leftJoin('users_projects', 'users_projects.project_id', 'projects.id')
        .where('users_projects.user_id', userId)
        .orWhere('projects.owner_id', userId);
    },
    shareWithUser: function(userId, projectId, connection) {
      return (connection || db).insert({
        user_id: userId,
        project_id: projectId
      })
      .into('users_projects');
    },
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
