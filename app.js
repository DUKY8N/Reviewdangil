var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const mysql = require('promise-mysql');
var app = express();
const PORT = process.env.PORT || 3000;

// Google Cloud MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
  host: '34.64.239.169', // Google Cloud SQL의 IP 주소
  user: 'root', // 데이터베이스 사용자명
  password: 'iJ8=dI%)}_0`X*|e', // 데이터베이스 암호
  database: 'Review_dangil' // 연결할 데이터베이스명
});

// 데이터베이스 연결
connection.then((conn) => {
  console.log('Google Cloud MySQL 데이터베이스 연결 성공!');
  startServer(); // 서버 시작 함수 호출
}).catch((err) => {
  console.error('데이터베이스 연결 오류:', err);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
