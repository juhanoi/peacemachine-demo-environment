var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('visualization', { title: 'Peace Machine - Visualization' });
});

module.exports = router;
