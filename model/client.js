var db = require('../db/dbconfig');
var knex = db.knex;
var bookshelf = db.bookshelf;
var _ = require('lodash');

console.log("Checking for table 'clients'");
knex.schema.hasTable('clients').then(function (exists) {
  if (!exists) {
    console.log("Creating table 'clients'.")
    return knex.schema.createTable('clients', function (table) {
      table.increments('id').primary();
      table.string('name');
      table.string('api_client_id', 20).unique().index();
      table.string('api_client_secret', 40);
    });
    return create;
  }
}).catch(function (err) {
  console.log("Error creating table: " + JSON.stringify(err));
});

module.exports = bookshelf.Model.extend({
  tableName: 'clients'
})
