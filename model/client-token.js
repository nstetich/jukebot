var _ = require('lodash');
var db = require('../db/dbconfig');
var crypto = require('crypto');
var moment = require('moment');

var Client = require('./client')

function randBytes(n) {
  return new Buffer(crypto.randomBytes(n)).toString('base64');
}

var ClientToken = db.bookshelf.Model.extend({
  tableName: 'client_tokens',

  initialize: function () {
    this.on('creating', function () {
      var now = moment();
      this.set('api_client_token', randBytes(21));
      this.set('created', now.toDate());
      this.set('expires', moment(now).add(30, 'seconds').toDate()); // TODO move to config
    });
  },

  client: function() {
    return this.belongsTo(Client);
  }
});

module.exports = ClientToken;
