var express = require('express');
var { config, log } = require('../config/index');
const { COOKIE_KEY_CODE, COOKIE_KEY_AUTH, COOKIE_KEY_STATE } = require('../constant/cookiekeys');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ test: 555 })
});

router.put('/cookie', function (req, res) {
  const { expires, cookies, httpOnly } = req.body
  res.setHeader('Set-Cookie', Object.entries(cookies).map(([name, value]) => `${name}=${value}; SameSite=None; httpOnly=${httpOnly} ;Secure=true; Domian=${config.domain}; Path=/; ${expires ? `expires=${expires}` : ''}`));
  res.json({ status: 'cookie set' })
})

router.get('/login', function (req, res) {
  const code = req.cookies?.[COOKIE_KEY_CODE]
  const authkey = req.cookies?.[COOKIE_KEY_AUTH]
  const state = req.cookies?.[COOKIE_KEY_STATE]
  if (code && state && authkey) {
    var userAgent = req.headers['user-agent']; //获取客户端使用的操作系统和浏览器的名称和版本
    var host = req.headers['host']; //获取服务端被请求资源的Internet主机和端口号
    var referer = req.headers['referer']; //获取请求的来源
    var url = req.url; //获取服务端被请求资源的路径
    var ip = req.connection.remoteAddress;
    console.log(userAgent,
      host,
      referer,
      url,
      ip, authkey);//获取客户端的ip
    res.json({ status: 0, msg: 'success', token: authkey })
  } else {
    res.json({ status: 1, msg: 'express' })
  }
})

module.exports = router;
