var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mysql = require("mysql");
var session = require("express-session");
const crypto = require("crypto");
var flash = require("connect-flash");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var loginRouter = require("./routes/login");
var signUpRouter = require("./routes/signup");
var reviewRouter = require("./routes/review");
var userupdateRouter = require("./routes/userupdate");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware 설정
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/..", express.static(path.join(__dirname, "..")));
app.use(flash());

// 세션 미들웨어 설정
const secret = crypto.randomBytes(64).toString("hex");
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  }),
);

// 라우트 설정
app.use("/", indexRouter);
app.use("/api/login", loginRouter);
app.use("/users", usersRouter);
app.use("/api/signUp", signUpRouter);
app.use("/api/review", reviewRouter);
app.use("/api/userupdate", userupdateRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Google Cloud MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
  host: "34.64.239.169", // Google Cloud SQL의 IP 주소
  user: "root", // 데이터베이스 사용자명
  password: "iJ8=dI%)}_0`X*|e", // 데이터베이스 암호
  database: "Review_dangil", // 연결할 데이터베이스명
});

connection.connect(function (err) {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }

  console.log("Connected to database.");
});
app.locals.connection = connection;
module.exports = app;
