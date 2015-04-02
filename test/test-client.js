var chai = require('chai');
chai.use(require('chai-as-promised'));
var assert = chai.assert;

var proxyquire = require('proxyquire');
var crypto = require('crypto');

function rand(n) {
  return new Buffer(crypto.pseudoRandomBytes(n)).toString('base64');
}

describe('Client', function () {
  var knex, Client;

  beforeEach(function () {
    knex = require('knex')({
      client: 'sqlite',
      connection: {
        filename: ':memory:'
      }
    });
    knex.schema.dropTableIfExists('clients');
    Client = proxyquire('../model/client', {
      dbConfig: {
        knex: knex,
        bookshelf: require('bookshelf')(knex),
      }
    });
  });

  it("should have a Client", function () {
    assert.ok(Client);
  })

  it("should save all fields on the record", function () {
    var clientId = rand(12);
    var client = new Client({
      name: "Hello Client",
      api_client_id: clientId,
      api_client_secret: "secret"
    })
    return client.save().then(function (model) {
      return new Client({api_client_id: clientId}).fetch()
    }).then(function (model) {
      assert.ok(model);
      assert.equal(client.get("name"), "Hello Client");
      assert.equal(client.get("api_client_id"), clientId);
      assert.equal(client.get("api_client_secret"), "secret");
    });
  });

});
