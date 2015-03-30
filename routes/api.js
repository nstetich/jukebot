var express = require('express');
var router = express.Router();

var Client = require('../model/client.js');

router.get('/clients', function(req, res) {
  new Client().fetchAll()
    .then(function (models) {
      res.send({clients: models});
    }).catch(function(err) {
      res.status(400).send(err);
    })
});

router.get('/clients/:id', function (req, res) {
  new Client({id: req.params.id}).fetch()
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

module.exports = router;
