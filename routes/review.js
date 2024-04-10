var express = require("express");
var mysql = require("mysql");
var router = express.Router();

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

module.exports = router;
