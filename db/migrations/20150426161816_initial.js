/* jshint node:true */
"use strict";

exports.up = function(knex, Promise) {
  return knex.schema.createTable('clients', function (table) {
    table.increments('id').primary();
    table.string('name');
    table.string('api_client_id', 20).unique().index();
    table.string('api_client_secret', 40);
    table.string('slack_channel_name', 255).unique().index();
    table.string('slack_callback_url', 255);
    table.string('slack_slash_command_token', 30);
  }).then(function () {
    return knex.schema.createTable('users', function (table) {
      table.integer('github_id').primary();
      table.string('github_username');
      table.string('avatar_url');
    });
  }).then(function () {
    return knex.schema.createTable('client_tokens', function (table) {
      table.increments('id').primary();
      table.integer('client_id').unsigned()
        .references('id').inTable('clients').notNullable();
      table.string('api_client_token', 40).index();
      table.dateTime('created');
      table.dateTime('expires');
    });
  });
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('client_tokens')
    .then(function () {
      return knex.schema.dropTable('clients');
    })
  ]);
};
