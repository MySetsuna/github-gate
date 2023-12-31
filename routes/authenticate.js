var express = require("express");
var https = require("https");
var qs = require("querystring");
var { config, log } = require("../config/index");
const { COOKIE_KEY_STATE } = require("../constant/cookiekeys");
var router = express.Router();
var { publicKey, privateKey, encrypt } = require("../keys");

/* GET users listing. */
router.get("/:code/:state", function (req, res) {
  log("authenticating code:", req.params.code, true);
  const { code, state } = req.params;
  if (state) {
    authenticate(code, function (err, token) {
      var result;
      if (err || !token) {
        result = { error: err || "bad_code" };
        console.log(result.error);
      } else {
        var userAgent = req.headers["user-agent"]; //获取客户端使用的操作系统和浏览器的名称和版本
        var host = req.headers["host"]; //获取服务端被请求资源的Internet主机和端口号
        var referer = req.headers["referer"]; //获取请求的来源
        // var url = req.url; //获取服务端被请求资源的路径
        var ip = req.connection.remoteAddress;
        result = { token };
        const authkey = encrypt(
          `${userAgent}${config.splitTag}${host}${config.splitTag}${referer}${config.splitTag}${ip}${config.splitTag}${state}${config.splitTag}${code}${config.splitTag}${token}`
        );

        result.authkey = authkey;
      }
      res.json(result);
    });
  } else {
    res.json({ error: "error state" });
  }
});

function authenticate(code, cb) {
  var data = qs.stringify({
    client_id: config.oauth_client_id,
    client_secret: config.oauth_client_secret,
    code,
  });

  var reqOptions = {
    host: config.oauth_host,
    port: config.oauth_port,
    path: config.oauth_path,
    method: config.oauth_method,
    headers: { "content-length": data.length },
  };

  var body = "";
  var req = https.request(reqOptions, function (res) {
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
      body += chunk;
    });
    res.on("end", function () {
      cb(null, qs.parse(body).access_token);
    });
  });

  req.write(data);
  req.end();
  req.on("error", function (e) {
    cb(e.message);
  });
}

module.exports = router;
