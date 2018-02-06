var express = require('express');
var router = express.Router();

var discussions = {
  raw: require('../public/data/teemus-discussion.json'),
  watson: require('../public/data/teemus-discussion-watson.json'),
  human: require('../public/data/teemus-discussion-human.json')
};
console.log(discussions.watson)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('discussion', { title: 'Peace Machine - Discussion', discussions: discussions });
});

module.exports = router;
