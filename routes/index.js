var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.redirect("/login");
});

router.get("/login", function (req, res, next) {
    res.render("login", { message: req.flash('error') });
});

// 유저 페이지

router.get("/signup", function (req, res, next) {
	res.render("signUp");
});

router.get("/home", function (req, res, next) {
	res.render("userHome");
});

router.get("/more-review", function (req, res, next) {
	res.render("moreReview");
});

router.get("/announce-read", function (req, res, next) {
	res.render("announceRead");
});

router.get("/review-read", function (req, res, next) {
	res.render("reviewRead");
});

router.get("/review-write", function (req, res, next) {
	res.render("reviewWrite");
});

function ensureAuthenticated(req, res, next) {
  console.log('ensureAuthenticated is called'); // ensureAuthenticated 함수가 호출되었음을 출력
  console.log('req.isAuthenticated():', req.isAuthenticated()); // req.isAuthenticated()의 반환값 출력
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

router.get("/mypage", ensureAuthenticated, function (req, res, next) {
  console.log('req.session:', req.session); // 세션 전체를 출력
  console.log('req.session.passport:', req.session.passport); // 세션의 passport 객체 전체를 출력
  var userId = req.session.passport.user;
  console.log('userId:', userId); // 사용자 ID 출력
  connection.query('SELECT * FROM users WHERE id = ?', [userId], function(err, results) {
    if (err) return next(err);
    var user = results[0];
    res.render("myPage", { user: user });
  });
});
// 관리자 페이지

router.get("/admin/announce-write", function (req, res, next) {
	res.render("announceWrite");
});

router.get("/admin/review-read", function (req, res, next) {
	res.render("reviewRead");
});

router.get("/admin/user-management", function (req, res, next) {
	res.render("userManagement");
});

module.exports = router;
