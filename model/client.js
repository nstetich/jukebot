var db = require('../db/dbconfig');
var knex = db.knex;
var bookshelf = db.bookshelf;
var _ = require('lodash');

// TODO: Create a promise that will return once the table is ensured to exist
// and figure out how to use that promise in the rest of the code.
console.log("Checking for table 'clients'");
var loaded = knex.schema.hasTable('clients').then(function (exists) {
  console.log("Table 'clients' exists?  " + exists);
  if (!exists) {
    console.log("Creating table 'clients'.")
    return knex.schema.createTable('clients', function (table) {
      table.increments('id').primary();
      table.string('name');
      table.string('api_client_id', 20).unique().index();
      table.string('api_client_secret', 40);
    });
  }
}).catch(function (err) {
  console.log("Error creating table: " + JSON.stringify(err));
});

var Client = bookshelf.Model.extend({
  tableName: 'clients',

  initialize: function() {
    console.log("initialize");
    this.on('creating', function() {
      // console.log("creating. " + JSON.stringify(arguments));
    });
    this.on('saving', function() {
      // console.log("saving. " + JSON.stringify(arguments));
    });
  }
});

Client.loaded = loaded

module.exports = Client;
