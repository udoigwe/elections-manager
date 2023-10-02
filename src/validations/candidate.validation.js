const { body, param} = require("express-validator");

module.exports = {
    create: [
		body("election_id")
			.exists({ checkFalsy: true })
			.withMessage("Election ID is required")
            .isNumeric()
            .withMessage("Election ID must be a number"),
        body("candidate_fullname")
            .exists({ checkFalsy: true })
            .withMessage("Candidate Full Name is required"),
        body("candidate_bio")
            .exists({ checkFalsy: true })
            .withMessage("Candidate Bio is required")        
	],
    readOne: [
        param("candidate_id")
            .exists({ checkFalsy: true })
            .withMessage("Candidate ID is required")
    ],
    update: [
		body("election_id")
			.exists({ checkFalsy: true })
			.withMessage("Election ID is required")
            .isNumeric()
            .withMessage("Election ID must be a number"),
        body("candidate_fullname")
            .exists({ checkFalsy: true })
            .withMessage("Candidate Full Name is required"),
        body("candidate_bio")
            .exists({ checkFalsy: true })
            .withMessage("Candidate Bio is required"),
        param("candidate_id")
            .exists({ checkFalsy: true })
            .withMessage("Candidate ID is required")
            .isNumeric()
            .withMessage("Candidate ID must be a number")       
	],
    deleteOne: [
        param("candidate_id")
            .exists({ checkFalsy: true })
            .withMessage("Candidate ID is required")
    ]
}