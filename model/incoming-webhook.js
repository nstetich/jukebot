var _ = require('lodash');
var db = require('../db/dbconfig');
var crypto = require('crypto');
var moment = require('moment');

var Client = require('./client')

var SlackIncomingWebhook = db.bookshelf.Model.extend({
  tableName: 'slack_incoming_webhooks',

  client: function() {
    return this.belongsTo(Client);
  }
});

module.exports = SlackIncomingWebhook;
