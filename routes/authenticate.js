
var express = require('express');
var https = require('https');
var qs = require('querystring');
var { config, log } = require('../config/index')
var router = express.Router();

/* GET users listing. */
router.get('/:code', function (req, res) {
    log('authenticating code:', req.params.code, true);
    authenticate(req.params.code, function (err, token) {
        var result;
        if (err || !token) {
            result = { error: err || 'bad_code' };
            log(result.error);
        } else {
            result = { token };
            log('token', result.token, true);
            res.setHeader('Set-Cookie', `${config.cookie_key_token}=${token}; SameSite=None; Secure=true; Path=/; Domain=${config.origin}`);
        }
        res.json(result);
    });
});

function authenticate(code, cb) {
    var data = qs.stringify({
        client_id: config.oauth_client_id,
        client_secret: config.oauth_client_secret,
        code
    });

    var reqOptions = {
        host: config.oauth_host,
        port: config.oauth_port,
        path: config.oauth_path,
        method: config.oauth_method,
        headers: { 'content-length': data.length }
    };

    var body = '';
    var req = https.request(reqOptions, function (res) {
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
