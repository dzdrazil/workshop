'use strict';

module.exports.up = function(knex, Promise) {
  console.log('running init migration');

  return Promise.resolve()
    .then(function() {
      // USERS TABLE
      return knex.schema.createTable('users', function(table) {
        table.uuid('id').primary();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('email').unique().notNullable();
        table.timestamps();
      });
    })
    // SESSIONS TABLE
    .then(function() {
      return knex.schema.createTable('sessions', function(table) {
        table.uuid('id')
            .primary();
        table.uuid('user_id')
            .references('id').inTable('users');
        table.timestamps();
      });
    })
    // PROJECTS TABLE
    .then(function() {
      return knex.schema.createTable('projects', function(table) {
        table.uuid('id').primary();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.uuid('owner_id')
          .references('id').inTable('users')
          .notNullable();
        table.timestamps();
      });
    })
    // USERS_PROJECTS JOIN
    .then(function() {
      return knex.schema.createTable('users_projects', function(table) {
        table.uuid('user_id')
          .references('id').inTable('users')
          .notNullable();
        table.uuid('project_id')
          .references('id').inTable('projects')
          .notNullable();

        // table.primary('user_id', 'project_id');
      });
    })
    .catch(function(e) {
      console.log(e.stack);
    });
};

module.exports.down = function(knex, Promise) {

};
