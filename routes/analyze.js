var express = require('express');
var router = express.Router();
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var config = require('../config.json');

var analyzer = new ToneAnalyzerV3({
  username: config.toneanalyzer.username,
  password: config.toneanalyzer.password,
  version_date: config.toneanalyzer.version_date
});

/* GET users listing. */
router.post('/', function(req, res, next) {

  var text = req.body.text;
  var params = {
    'tone_input': { text: text },
    'content_type': 'application/json'
  };

  analyzer.tone(params, function(error, response) {
    if (error) {
      console.log('Error from Watson: ', error);
    } else {
      res.json(response);
    }
  });

  /*
  analyzer.toneChat(params, function (error, response) {
    if (error) console.log("Error: " + error);
    else res.json(response);
  });
  */
});

module.exports = router;
