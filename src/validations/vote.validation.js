const { body, param} = require("express-validator");

module.exports = {
    create: [
        body("election_id")
			.exists({ checkFalsy: true })
			.withMessage("Election ID is required")
            .isNumeric()
            .withMessage("Election ID must be a number"),
        body("candidate_id")
            .exists({ checkFalsy: true })
            .withMessage("Candidate Bio is required")
            .isNumeric()
            .withMessage("Candidate ID must be a number")
    ],
    readOne: [
        param("vote_id")
			.exists({ checkFalsy: true })
			.withMessage("Vote ID is required")
            .isNumeric()
            .withMessage("Vote ID must be a number")
    ]
}