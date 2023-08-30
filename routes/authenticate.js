
var express = require('express');
const http = require('http');
const https = require('https');
const qs = require('querystring');
var { loadConfig, log } = require('../config/index')
var router = express.Router();
var config = loadConfig()
console.log(config, 'config');
/* GET users listing. */
router.get('/:code', function (req, res) {
    log('authenticating code:', req.params.code, true);
    authenticate(req.params.code, function (err, token) {
        let result;
        if (err || !token) {
            result = { error: err || 'bad_code' };
            log(result.error);
        } else {
            result = { token };
            log('token', result.token, true);
        }
        res.json(result);
    });
});

function authenticate(code, cb) {
    const data = qs.stringify({
        client_id: config.oauth_client_id,
        client_secret: config.oauth_client_secret,
        code
    });

    const reqOptions = {
        host: config.oauth_host,
        port: config.oauth_port,
        path: config.oauth_path,
        method: config.oauth_method,
        headers: { 'content-length': data.length }
    };

    let body = '';
    const req = https.request(reqOptions, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) { body += chunk; });
        res.on('end', function () {
            cb(null, qs.parse(body).access_token);
        });
    });

    req.write(data);
    req.end();
    req.on('error', function (e) { cb(e.message); });
}

module.exports = router;
