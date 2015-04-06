var chai = require('chai');
chai.use(require('chai-as-promised'));
var assert = chai.assert;
var proxyquire = require('proxyquire');
var _ = require('lodash');
var moment = require('moment');

describe('SlackIncomingWebhook', function () {
  var knex, bookshelf, Client, SlackIncomingWebhook;

  before(function () {
    var knexfile = require('../db/knexfile');
    knex = require('knex')(knexfile.unit);
    bookshelf = require('bookshelf')(knex);

    Client = proxyquire('../model/client', {
      '../db/dbconfig': {
        knex: knex,
        bookshelf: bookshelf
      }
    });

    SlackIncomingWebhook = proxyquire('../model/incoming-webhook', {
      '../db/dbconfig': {
        knex: knex,
        bookshelf: bookshelf
      }
    });

    return knex.migrate.latest({
      directory: 'db/migrations'
    });
  });

  afterEach(function () {
    return knex('slack_incoming_webhooks').delete();
    return knex('clients').delete();
  });

  it("should not allow a webhook to be saved without a client", function () {
    assert.isRejected(new SlackIncomingWebhook().save());
  });

  describe("with existing Client", function () {
    var client;

    beforeEach(function () {
      return Client.forge({name: "foo"}).save()
        .then(function (model) {
          client = model;
        });
    });

    it("should save a webhook", function () {
      return new SlackIncomingWebhook({
        client_id: client.id,
        url: 'http://example.com/webhook'
      }).save()
        .then(function (model) {
          assert.ok(model);
        });
    });

    it("should be loaded with Client", function () {
      return new SlackIncomingWebhook({
        client_id: client.id,
        url: 'http://example.com/webhook'
      }).save()
        .then(function (model) {
          assert.ok(model);
          return new Client({id: client.id}).fetch({
            withRelated: ['slackIncomingWebhooks']
          });
        }).then(function (model) {
          assert.ok(model.related('slackIncomingWebhooks'));
        });
    });
  });
});
