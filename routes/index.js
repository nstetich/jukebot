var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    req: req
  });
});

router.get('/testclient', function (req, res) {
  res.render('testclient', {
    title: 'Test Client'
  });
});

module.exports = router;
