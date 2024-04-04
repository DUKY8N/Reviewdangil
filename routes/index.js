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

router.get("/mypage", function (req, res, next) {
	res.render("myPage");
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
