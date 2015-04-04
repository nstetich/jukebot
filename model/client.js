var _ = require('lodash');
var db = require('../db/dbconfig');
var crypto = require('crypto');
var _ = require('lodash');

function randBytes(n) {
  return new Buffer(crypto.randomBytes(n)).toString('hex');
}

var Client = db.bookshelf.Model.extend({
  tableName: 'clients',

  initialize: function() {
    this.on('creating', function() {
      if (!this.get('api_client_id')) {
        this.set("api_client_id", randBytes(10));
      }
      if (!this.get("api_client_secret")) {
        this.set("api_client_secret", randBytes(20));
      }
    });
  }
});

module.exports = Client;
