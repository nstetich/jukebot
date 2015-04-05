var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    req: req
  });
});

router.get('/sockets', function (req, res) {
  res.render('sockets', {
    title: 'Sockets'
  })
});

module.exports = router;
