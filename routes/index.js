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
  res.render('signUp', { message: req.flash('message') });
});

router.get("/home", function (req, res, next) {
  console.log("User ID in session:", req.session.passport.user);
  res.render("userHome");
});

router.get(
  "/more-review/:LATITUDE/:LONGTITUDE/:page?",
  function (req, res, next) {
    const { LATITUDE, LONGTITUDE, page = 1 } = req.params; // 기본 페이지를 1로 설정
    const offset = (page - 1) * 12;

    // 총 리뷰 개수를 조회하는 쿼리
    const countQuery = `
    SELECT COUNT(*) AS total
    FROM review r
    JOIN location l ON r.location_id = l.location_id
    WHERE l.LATITUDE BETWEEN ? - 0.01 AND ? + 0.01
    AND l.LONGTITUDE BETWEEN ? - 0.01 AND ? + 0.01
  `;

    // 리뷰 데이터를 조회하는 쿼리
    const selectReviewQuery = `
    SELECT r.REVIEW_ID, r.USER_ID, r.RATING, r.CREATED_DATE, r.CONTENTS, r.HEADLINE,
      l.LOCATION_NAME, l.LATITUDE, l.LONGTITUDE
    FROM review r
    JOIN location l ON r.location_id = l.location_id
    WHERE l.LATITUDE BETWEEN ? - 0.01 AND ? + 0.01
    AND l.LONGTITUDE BETWEEN ? - 0.01 AND ? + 0.01
    ORDER BY r.CREATED_DATE DESC
    LIMIT 12 OFFSET ?
  `;

    req.app.locals.connection.query(
      countQuery,
      [LATITUDE, LATITUDE, LONGTITUDE, LONGTITUDE],
      (error, result) => {
        if (error) return res.status(500).send({ error: error.message });

        const totalReviews = result[0].total;
        const totalPages = Math.ceil(totalReviews / 12);

        req.app.locals.connection.query(
          selectReviewQuery,
          [LATITUDE, LATITUDE, LONGTITUDE, LONGTITUDE, offset],
          (error, reviews) => {
            if (error) return res.status(500).send({ error: error.message });
            res.render("moreReview", {
              LATITUDE,
              LONGTITUDE,
              reviews,
              totalPages,
              page,
            });
          },
        );
      },
    );
  },
);
router.post("/review-delete/:REVIEW_ID", function (req, res, next) {
  const { REVIEW_ID } = req.params;

  const deleteReviewQuery = `
    DELETE FROM review
    WHERE REVIEW_ID = ?
  `;

  req.app.locals.connection.query(
    deleteReviewQuery,
    [REVIEW_ID],
    (error, result) => {
      if (error) return res.status(500).send({ error: error.message });

      // 삭제가 성공적으로 이루어진 후에 메시지를 설정합니다.
      res.json({ message: '리뷰가 성공적으로 삭제되었습니다.' });
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

      // 세션에서 message를 가져옵니다.
      const message = req.session.message;
      // message를 사용한 후에는 세션에서 삭제합니다.
      delete req.session.message;

      res.render("reviewRead", {
        review_id: REVIEW_ID,
        user: req.session.passport.user,
        user_id: reviews[0].USER_ID,
        rating: reviews[0].RATING,
        created_date: reviews[0].CREATED_DATE,
        content: reviews[0].CONTENTS,
        headline: reviews[0].HEADLINE,
        location_name: reviews[0].LOCATION_NAME,
        latitude: reviews[0].LATITUDE,
        longtitude: reviews[0].LONGTITUDE,
        message: message // 세션에서 가져온 message를 사용합니다.
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

router.get("/review-edit/:REVIEW_ID", function (req, res, next) {
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
      res.render("reviewEdit", {
        review_id: REVIEW_ID,
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
