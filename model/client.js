var _ = require('lodash');
var db = require('../db/dbconfig');

var Client = db.bookshelf.Model.extend({
  tableName: 'clients',

  initialize: function() {
    this.on('creating', function() {
      // console.log("creating. " + JSON.stringify(arguments));
    });
    this.on('saving', function() {
      // console.log("saving. " + JSON.stringify(arguments));
    });
  }
});

module.exports = Client;
