var _ = require('lodash');
var knexfile = require('./knexfile');
var config = knexfile[process.env.NODE_ENV || 'development'];
// config = _.extend(config, {debug: true});
var knex = require('knex')(config);

exports.knex = knex;
exports.bookshelf = require('bookshelf')(knex);
