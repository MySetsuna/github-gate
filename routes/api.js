var express = require('express');
var https = require('https');
var router = express.Router();

/* GET users listing. */
router.get('/*', function (req, res, next) {
  res.json({ code: 1 })
  // callGithubApi(req, res, (body) => {
  //   res.json(body)
  // })
});

function callGithubApi(req, cb) {
  var { authorization, accept } = req.headers
  console.log(req.url, req.headers);
  var data = qs.stringify({
    offset: 0,
  });

  var reqOptions = {
    host: config.api_host,
    port: config.oauth_port,
    path: req.url,
    method: "GET",
    headers: { 'content-length': data.length, accept, authorization }
  };

  let body = '';
  var req1 = https.request(reqOptions, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) { body += chunk; });
    res.on('end', function () {
      cb(qs.parse(body));
    });
  });

  req1.write(data);
  req1.end();
  req1.on('error', function (e) { cb(e.message); });
}

module.exports = router;
