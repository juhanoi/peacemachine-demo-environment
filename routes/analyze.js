var express = require('express');
var router = express.Router();
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var config = require('../config.json');

var analyzer = new ToneAnalyzerV3({
  username: config.toneanalyzer.username,
  password: config.toneanalyzer.password,
  version_date: config.toneanalyzer.version_date
});

function analyzeText(text) {
  var params = {
    'tone_input': { text: text },
    'content_type': 'application/json'
  };

  return new Promise((resolve, reject) => {
    analyzer.tone(params, function(error, response) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(response);
      }
    })
  });
};

/* GET users listing. */
router.post('/', function(req, res, next) {

  var text = req.body.text;
  var chat = JSON.parse(JSON.parse(text));

  analyzeText(chat.utterances[0].text)
    .then(result => res.json(result))
    .catch(error => res.status(500).send('Failed to get response from Watson'));
});

module.exports = router;
