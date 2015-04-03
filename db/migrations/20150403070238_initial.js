'use strict';

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('clients', function (table) {
      table.increments('id').primary();
      table.string('name');
      table.string('api_client_id', 20).unique().index();
      table.string('api_client_secret', 40);
    }),
    knex.schema.createTable('users', function (table) {
      table.integer('github_id').primary();
      table.string('github_username');
      table.string('avatar_url');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('clients'),
    knex.schema.dropTable('users')
  ]);
};
