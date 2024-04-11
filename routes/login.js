var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    function (req, username, password, done) {
      var connection = req.app.locals.connection;
      connection.query(
        "SELECT id, password FROM user WHERE id = ?",
        [username],
        function (err, results) {
          if (err) {
            return done(err);
          }

          if (results.length === 0) {
            return done(null, false, { message: "Incorrect username." });
          }

          var user = results[0];

          bcrypt.compare(password, user.password, function (err, isMatch) {
            if (err) {
              return done(err);
            }

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Incorrect password." });
            }
          });
        },
      );
    },
  ),
);

// Passport.js가 사용자 객체를 세션에 저장할 수 있도록 돕는 함수
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// 로그인 라우트
router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
    failureFlash: true,
  }),
);

module.exports = router;
