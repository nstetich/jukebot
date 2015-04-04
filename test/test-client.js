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

  it("should have a Client", function () {
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
      assert.equal(client.get("name"), "Hello Client");
      assert.equal(client.get("api_client_id"), 'clientId');
      assert.equal(client.get("api_client_secret"), "secret");
    });
  });

});
