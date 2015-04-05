'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('client_tokens', function (table) {
    table.increments('id').primary();
    table.integer('client_id').unsigned()
      .references('id').inTable('clients').notNullable();
    table.string('api_client_token', 40).index();
    table.dateTime('created');
    table.dateTime('expires');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('client_token');
};
