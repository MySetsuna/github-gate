var express = require('express');
const { COOKIE_KEY_CODE, COOKIE_KEY_AUTH, COOKIE_KEY_STATE } = require('../constant/cookiekeys');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ test: 555 })
});

router.put('/cookie', function (req, res) {
  console.log(req.body, 'req.body');
  const cookiesStr = Object.entries(req.body).filter(([key]) => key !== 'expires')
    .map(([key, value]) => `${key}=${value}`)
    .join("; ")
  console.log(cookiesStr, 'cookiesStr');
  const { expires, name, value } = req.body
  res.setHeader('Set-Cookie', `${name}=${value}; SameSite=None;  Secure=true; Path=/; expires=${expires}`);
  res.json({ status: 'cookie set' })
})

router.get('/login', function (req, res) {
  const code = req.cookies.code[COOKIE_KEY_CODE]
  const authkey = req.cookies.code[COOKIE_KEY_AUTH]
  const state = req.cookies.code[COOKIE_KEY_STATE]
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
  } else {
    res.json({ status: 'express' })
  }
})

module.exports = router;
