var knexfile = require('./knexfile');
var knex = require('knex')(knexfile[process.env.NODE_ENV || 'development']);

exports.knex = knex;
exports.bookshelf = require('bookshelf')(knex);
