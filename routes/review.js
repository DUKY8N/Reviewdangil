var express = require("express");
var mysql = require("mysql");
var router = express.Router();

// 리뷰 쓰기
router.post("/new-review", (req, res) => {
  const {
    LOCATION_NAME,
    LATITUDE,
    LONGTITUDE,
    USER_ID,
    RATING,
    CONTENTS,
    HEADLINE,
  } = req.body;

  const insertLocationQuery = `
		INSERT INTO location (LOCATION_NAME, LATITUDE, LONGTITUDE)
		VALUES (?, ?, ?)
	`;
  req.app.locals.connection.query(
    insertLocationQuery,
    [LOCATION_NAME, LATITUDE, LONGTITUDE],
    (error, locationResult) => {
      if (error) return res.status(500).send({ error: error.message });

      const locationId = locationResult.insertId;
      const insertReviewQuery = `
				INSERT INTO review (USER_ID, RATING, CREATED_DATE, location_id, CONTENTS, HEADLINE)
				VALUES (?, ?, NOW(), ?, ?, ?)
			`;

      req.app.locals.connection.query(
        insertReviewQuery,
        [USER_ID, RATING, locationId, CONTENTS, HEADLINE],
        (error, reviewResult) => {
          if (error) return res.status(500).send({ error: error.message });

          res.status(201).send({
            message: "Review successfully posted",
            reviewId: reviewResult.insertId,
          });
        },
      );
    },
  );
});

//리뷰 수정
router.put("/:REVIEW_ID", (req, res) => {
  const { REVIEW_ID } = req.params;
  const { RATING, CONTENTS } = req.body;
  console.log(REVIEW_ID, RATING, CONTENTS);

  const updateReviewQuery = `
		UPDATE review
		SET RATING = ?, CONTENTS = ?
		WHERE REVIEW_ID = ?
	`;

  req.app.locals.connection.query(
    updateReviewQuery,
    [RATING, CONTENTS, REVIEW_ID],
    (error, result) => {
      if (error) return res.status(500).send({ error: error.message });
      res.status(200).send({ message: "Review successfully updated" });
    },
  );
});

//리뷰 검색
router.get("/:LATITUDE/:LONGTITUDE/:page?", (req, res) => {
  const { LATITUDE, LONGTITUDE, page } = req.params;
  const offset = (page - 1 || 0) * 12;

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
    selectReviewQuery,
    [LATITUDE, LATITUDE, LONGTITUDE, LONGTITUDE, offset],
    (error, reviews) => {
      if (error) return res.status(500).send({ error: error.message });
      res.status(200).send({ reviews });
    },
  );
});

//게시물 보기
router.get("/:REVIEW_ID", (req, res) => {
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

      res.status(200).send({ reviews });
    },
  );
});

//게시물 삭제
router.delete("/:REVIEW_ID", (req, res) => {
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
      res.status(200).send({ message: "Review successfully deleted" });
    },
  );
});

module.exports = router;
