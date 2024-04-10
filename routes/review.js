var express = require("express");
var mysql = require("mysql");
var router = express.Router();

// 리뷰 쓰기
router.post("/new-review", (req, res) => {
	const { LOCATION_NAME, LATITUDE, LONGTITUDE, USER_ID, RATING, CONTENTS } =
		req.body;

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
                INSERT INTO review (USER_ID, RATING, CREATED_DATE, location_id, CONTENTS)
                VALUES (?, ?, NOW(), ?, ?)
            `;

			req.app.locals.connection.query(
				insertReviewQuery,
				[USER_ID, RATING, locationId, CONTENTS],
				(error, reviewResult) => {
					if (error)
						return res.status(500).send({ error: error.message });

					res.status(201).send({
						message: "Review successfully posted",
						reviewId: reviewResult.insertId,
					});
				}
			);
		}
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
		}
	);
});

module.exports = router;
