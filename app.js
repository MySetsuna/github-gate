var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/index');
var authRouter = require('./routes/authenticate');
var { config } = require('./config/index')

var app = express();
console.log(config.origin, 'config.origin');
// 解决跨域
app.use(cors({ origin: config.origin, credentials: true, maxAge: '1728000', httpOnly: true }));

app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/authenticate', authRouter);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
