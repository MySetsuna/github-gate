var express = require("express");
var { config, log } = require("../config/index");
const {
  COOKIE_KEY_CODE,
  COOKIE_KEY_AUTH,
  COOKIE_KEY_STATE,
} = require("../constant/cookiekeys");
var router = express.Router();
var { decrypt } = require("../keys");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ test: 'helow github-caller' });
});

router.post("/login", async function (req, res) {
  const { code, authkey, state } = req.body;
  if (code && state && authkey) {
    var userAgent = req.headers["user-agent"]; //获取客户端使用的操作系统和浏览器的名称和版本
    var host = req.headers["host"]; //获取服务端被请求资源的Internet主机和端口号
    var referer = req.headers["referer"]; //获取请求的来源
    // var url = req.url; //获取服务端被请求资源的路径
    var ip = req.connection.remoteAddress;
    // const encryptStr = `${userAgent}.${host}.${referer}.${url}.${ip}.${state}.${code}.${token}`
    let encryptStr;
    try {
      encryptStr = await decrypt(Buffer.from(authkey)).toString();
    } catch (error) {
      console.log(error);
    }
    const params = encryptStr?.split(config.splitTag);
    let token = "";
    if (
      params?.length &&
      params[0] == `${userAgent}` &&
      params[1] == `${host}` &&
      params[2] == `${referer}` &&
      params[3] == `${ip}` &&
      params[4] == `${state}` &&
      params[5] == `${code}`
    ) {
      token = params[6];
    }
    if (token) {
      res.json({ status: 0, msg: "success", token });
    } else {
      res.json({ status: 2, msg: "error" });
    }
  } else {
    res.json({ status: 1, msg: "express" });
  }
});

module.exports = router;
