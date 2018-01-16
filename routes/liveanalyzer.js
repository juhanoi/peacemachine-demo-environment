var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('liveanalyzer', { title: 'Peace Machine - Live Analyzer' });
});

module.exports = router;
