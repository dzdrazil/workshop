'use strict';

var Bossy = require('bossy');
var Promise = require('bluebird');
var knex = require('knex');
var path = require('path');

var cliDefinition = {
  h: {
    description: 'Show help',
    alias: 'help',
    type: 'boolean'
  },
  m: {
    description: 'Run all pending migrations',
    alias: 'migrate',
    type: 'boolean'
  },
  f: {
    description: 'Import the seed data',
    alias: 'seed',
    type: 'boolean'
  },
  r: {
    description: 'Reset the database prior to running migrations or fixtures',
    alias: 'reset',
    type: 'boolean'
  }
};


var settings = require('../../app.config.json').plugins['./db'];

module.exports = {
  development: {
    debug: settings.debug,
    client: 'pg',
    connection: settings.connection,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'seeds')
    }
  }
};

var args = Bossy.parse(cliDefinition);
if (args.h || (!args.m && !args.f)) {
  console.log(Bossy.usage(
    cliDefinition,
    'This can be run either via the knex migration/seed CLI or directly, if you don\'t have knex installed globally'
  ));
  return;
}

var db = knex(module.exports.development);

var initPromise = Promise.resolve();

if (args.r) {
  /* jshint quotmark:false */
  var dropSql = "SELECT 'DROP TABLE ' || n.nspname || '.' || " +
    " c.relname || ' CASCADE;' FROM pg_catalog.pg_class AS c LEFT JOIN " +
    " pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace WHERE relkind = " +
    " 'r' AND n.nspname NOT IN ('pg_catalog', 'pg_toast') AND " +
    " pg_catalog.pg_table_is_visible(c.oid)";
  initPromise = db.raw(dropSql)
    .then(function(response) {
      var rows = response.rows.map(function(row) {
        return row['?column?'];
      });

      function q(promise, query) {
        return promise.then(function() {return db.raw(query);});
      }

      var cleanTablesPromise = Promise.resolve();
      for (var i = 0; i < rows.length; i++) {
        cleanTablesPromise = q(cleanTablesPromise, rows[i]);
      }
      return cleanTablesPromise;
      // return Promise.map(rows, function(query) {
      //   return db.raw(query);
      // });
    });
}

var migratePromise;
if (args.m) {
  migratePromise = initPromise.then(function() {
    return db.migrate.latest(module.exports.development);
  });
} else {
  migratePromise = initPromise.then(function() {return Promise.resolve();});
}

var resultPromise;
if (args.f) {
  resultPromise = migratePromise.then(function() {
    console.log('calling db.seed.run');
    return db.seed.run(module.exports.development);
  });
} else {
  resultPromise = migratePromise;
}

resultPromise
  .then(function() {
    console.log('success');
    process.exit(0);
  })
  .catch(function(e) {
    console.log(e);
    process.exit(1);
  });
