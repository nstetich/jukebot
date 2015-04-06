'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('slack_incoming_webhooks', function (table) {
    table.increments('id').primary();
    table.integer('client_id').unsigned()
      .references('id').inTable('clients').notNullable();
    table.string('url', 255);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('slack_incoming_webhooks');
};
