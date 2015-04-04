var chai = require('chai');
var assert = chai.assert;
var proxyquire = require('proxyquire');
var _ = require('lodash');

describe('Client', function () {
  var knex, bookshelf, Client;

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

    return knex.migrate.latest({
      directory: 'db/migrations'
    });
  });

  afterEach(function () {
    return knex('clients').delete();
  });

  it("should have valid test setup", function () {
    assert.ok(knex);
    assert.ok(bookshelf);
    assert.ok(Client);
  })

  it("should save all fields on the record", function () {
    var client = new Client({
      name: "Hello Client",
      api_client_id: "clientId",
      api_client_secret: "secret"
    })
    return client.save().then(function (model) {
      return new Client({api_client_id: 'clientId'}).fetch()
    }).then(function (model) {
      assert.ok(model);
      assert.equal(model.get("name"), "Hello Client");
      assert.equal(model.get("api_client_id"), 'clientId');
      assert.equal(model.get("api_client_secret"), "secret");
    });
  });

  it("should add default api_client_id for a new client", function () {
    function assertRandomHex(val, len) {
      assert.match(val, /^[0-9a-f]+$/);
      assert.lengthOf(val, len);
    }
    var client = new Client({
      name: "Newbie Client",
      api_client_secret: "s3Kr3t!"
    })
    return client.save().then(function (model) {
      assertRandomHex(model.get('api_client_id'), 20);
      assert.equal(model.get('api_client_secret'), 's3Kr3t!');
    });
  });

  it("should add default api_client_secret for a new client", function () {
    function assertRandomHex(val, len) {
      assert.match(val, /^[0-9a-f]+$/);
      assert.lengthOf(val, len);
    }
    var client = new Client({
      name: "Newbie Client",
      api_client_id: "neeeewbie"
    })
    return client.save().then(function (model) {
      assert.equal(model.get('api_client_id'), 'neeeewbie');
      assertRandomHex(model.get('api_client_secret'), 40);
    });
  });

  it ("should not reuse api_client_id and api_client_secret", function () {
    var id, secret;
    return new Client({name: "First Client"}).save().then(function (first) {
      id = first.get('api_client_id');
      secret = first.get('api_client_secret');
      return new Client({name: "Second Client"}).save();
    }).then(function (second) {
      assert.notEqual(second.get('api_client_id'), id);
      assert.notEqual(second.get('api_client_secret'), secret);
    });
  })

  it("should not overwrite api_client_id and api_client_secret for existing client", function () {
    var id, secret;
    var client = new Client({
      name: "Oldbie Client"
    })
    return client.save().then(function (model) {
      id = model.get('api_client_id');
      secret = model.get('api_client_secret');
      client.set("name", "same client, new name");
      return client.save();
    }).then(function (model) {
      assert.equal(model.get("name"), "same client, new name");
      assert.equal(model.get("api_client_id"), id);
      assert.equal(model.get("api_client_secret"), secret);
    });
  });

});
