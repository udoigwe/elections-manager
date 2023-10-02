const { body, param} = require("express-validator");

module.exports = {
    create: [
		body("election_title")
			.exists({ checkFalsy: true })
			.withMessage("Election title is required")
	],
    update: [
        param("election_id")
            .exists({ checkFalsy: true })
            .withMessage("Election ID is required"),
        body("election_title")
            .exists({ checkFalsy: true })
            .withMessage("Election Title is required")
    ],
    readOne: [
        param("election_id")
            .exists({ checkFalsy: true })
            .withMessage("Election ID is required")
    ],
    deleteOne: [
        param("election_id")
            .exists({ checkFalsy: true })
            .withMessage("Election ID is required")
    ]
}