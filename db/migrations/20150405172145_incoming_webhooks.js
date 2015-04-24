exports.up = function(knex, Promise) {
  return knex.schema.createTable('clients', function (table) {
    table.increments('id').primary();
    table.string('name');
    table.string('api_client_id', 20).unique().index();
    table.string('api_client_secret', 40);
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
  }).then(function () {
    return knex.schema.createTable('slack_incoming_webhooks', function (table) {
      table.increments('id').primary();
      table.integer('client_id').unsigned()
        .references('id').inTable('clients').notNullable();
      table.string('url', 255);
    });
  });
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
    Promise.all([
      knex.schema.dropTable('client_tokens'),
      knex.schema.dropTable('slack_incoming_webhooks')
    ]).then(function () {
      return knex.schema.dropTable('clients');
    })
  ]);
};
