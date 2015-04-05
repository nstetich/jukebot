var chai = require('chai');
chai.use(require('chai-as-promised'));
var assert = chai.assert;
var proxyquire = require('proxyquire');
var _ = require('lodash');
var moment = require('moment');

describe('ClientToken', function () {
  var knex, bookshelf, Client, ClientToken;

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

    ClientToken = proxyquire('../model/client-token', {
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
    return knex('client_tokens').delete();
    return knex('clients').delete();
  });

  it("should not allow a token to be saved without a client", function () {
    return assert.isRejected(new ClientToken().save());
  });

  describe("with existing Client", function () {
    var client;

    function assertRandomHex(val, len) {
      assert.match(val, /^[0-9a-f]+$/);
      assert.lengthOf(val, len);
    }

    beforeEach(function () {
      return Client.forge({name: "foo"}).save()
        .then(function (model) {
          client = model;
        });
    });

    it("should save a token", function () {
      return new ClientToken({client_id: client.id}).save()
        .then(function (model) {
          assert.ok(model);
        });
    });

    it("should associate a client with a token", function () {
      return ClientToken.forge({client_id: client.get('id')}).save()
        .then(function (model) {
          return ClientToken.forge({id: model.id}).fetch({
            withRelated: ['client']
          });
        }).then(function (model) {
          assert.equal(model.related('client').get('id'), client.id);
        });
    });

    it("should generate a random token value on creation", function () {
      return new ClientToken({client_id: client.id}).save()
        .then(function (model) {
          assertRandomHex(model.get('api_client_token'), 40);
        });
    });

    it("should save a created timestamp", function () {
      return new ClientToken({client_id: client.id}).save()
        .then(function (model) {
          assert.ok(model.get('created'));
        });
    });

    it("should save an expires timestamp", function () {
      return new ClientToken({client_id: client.id}).save()
        .then(function (model) {
          assert.ok(moment(model.get('expires')));
          var expires = moment(model.get('expires')),
              created = moment(model.get('created'));
          assert.isTrue(moment(expires).isAfter(created), 'expired is after created');
        });
    });
  })
});
