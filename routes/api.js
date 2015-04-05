var express = require('express');
var router = express.Router();

var _ = require('lodash');
var Promise = require('bluebird');

var Client = require('../model/client.js');
var ClientToken = require('../model/client-token.js');

router.get('/clients', function(req, res) {
  new Client().fetchAll()
    .then(function (models) {
      res.send({clients: models});
    }).catch(function(err) {
      res.status(400).send(err);
    })
});

router.get('/clients/:id', function (req, res) {
  new Client({api_client_id: req.params.id}).fetch()
    .then(function (model) {
      if (model) {
        res.send(model);
      } else {
        res.status(404).send();
      }
    }).catch(function (err) {
      res.status(400).send(err);
    });
});

router.put('/clients/:id', function (req, res) {
  new Client(_.extend(req.body, {api_client_id: req.params.id})).save()
    .then(function (model) {
      res.send(model);
    }).catch(function (err) {
      res.status(400).send(err);
    });
});

router.post('/clients', function (req, res) {
  new Client(req.body).save()
    .then(function (model) {
      res.send(model);
    }).catch(function (err) {
      res.status(400).send(err);
    });
});

router.post('/tokens', function (req, res) {
  var credentials = req.body;
  new Client({api_client_id: credentials.clientId}).fetch()
    .then(function (model) {
      if (credentials.clientSecret == model.get('api_client_secret')) {
        return new ClientToken({client_id: model.id}).save()
      } else {
        return Promise.reject({
          status: 401,
          message: "Not authorized."
        });
      }
    }).then(function (model) {
      res.send({
        token: model.get('api_client_token')
      });
    }).catch (function (err) {
      var status = err.status || 400
      res.status(status).send(err);
    });
});

module.exports = router;
