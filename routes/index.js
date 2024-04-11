var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("/login");
});

router.get("/login", function (req, res, next) {
  res.render("login", { message: req.flash("error") });
});

// 유저 페이지

router.get("/signup", function (req, res, next) {
  res.render("signUp");
});

router.get("/home", function (req, res, next) {
  console.log("User ID in session:", req.session.passport.user);
  res.render("userHome");
});

router.get("/more-review", function (req, res, next) {
  // 데이터베이스에서 리뷰를 가져옵니다.
  req.app.locals.connection.query(
    "SELECT * FROM review",
    function (error, reviews) {
      if (error) {
        // 에러 처리
        console.error(error);
        res.status(500).send("Database Error");
      } else {
        // 'moreReview' 템플릿에 리뷰 데이터를 전달하고 렌더링합니다.
        res.render("moreReview", { reviews: reviews });
      }
    },
  );
});

router.get("/announce-read", function (req, res, next) {
  res.render("announceRead");
});

router.get("/review-read/:REVIEW_ID", function (req, res, next) {
  const { REVIEW_ID } = req.params;

  const selectReviewQuery = `
    SELECT r.REVIEW_ID, r.USER_ID, r.RATING, r.CREATED_DATE, r.CONTENTS, r.HEADLINE,
    l.LOCATION_NAME, l.LATITUDE, l.LONGTITUDE

    FROM review r
    JOIN location l ON r.location_id = l.location_id
    WHERE REVIEW_ID = ?
	`;

  req.app.locals.connection.query(
    selectReviewQuery,
    [REVIEW_ID],
    (error, reviews) => {
      if (error) return res.status(500).send({ error: error.message });
      res.render("reviewRead", {
        user: req.session.passport.user,
        user_id: reviews[0].USER_ID,
        rating: reviews[0].RATING,
        created_date: reviews[0].CREATED_DATE,
        content: reviews[0].CONTENTS,
        headline: reviews[0].HEADLINE,
        location_name: reviews[0].LOCATION_NAME,
        latitude: reviews[0].LATITUDE,
        longtitude: reviews[0].LONGTITUDE,
      });
    },
  );
});

router.get(
  "/review-write/:LATITUDE/:LONGTITUDE/:LOCATION_NAME",
  function (req, res, next) {
    res.render("reviewWrite", {
      latitude: req.params.LATITUDE,
      longitude: req.params.LONGTITUDE,
      locationName: req.params.LOCATION_NAME,
      user: req.session.passport.user,
    });
  },
);

function ensureAuthenticated(req, res, next) {
  console.log("ensureAuthenticated is called"); // ensureAuthenticated 함수가 호출되었음을 출력
  if (req.session && req.session.passport && req.session.passport.user) {
    return next();
  }
  res.redirect("/login");
}

router.get("/mypage", ensureAuthenticated, function (req, res, next) {
  var userId = req.session.passport.user;
  var connection = req.app.locals.connection;
  connection.query(
    "SELECT * FROM user WHERE id = ?",
    [userId],
    function (err, results) {
      if (err) return next(err);
      var user = results[0];
      res.render("myPage", { user: user, message: req.flash("message") });
    },
  );
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
