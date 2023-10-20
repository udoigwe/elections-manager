const { body, param} = require("express-validator");

module.exports = {
    create: [
		body("user_firstname")
			.exists({ checkFalsy: true })
			.withMessage("User First Name is required"),
		body("user_lastname")
			.exists({ checkFalsy: true })
			.withMessage("User Last Name is required"),
        body("user_email")
            .exists({ checkFalsy: true })
            .withMessage("User Email is required")
            .isEmail()
            .withMessage("User Email must be a valid email address"),
        body("user_role")
            .exists({ checkFalsy: true })
            .withMessage("User Role is required"),       
        body("password")
            .exists({ checkFalsy: true })
            .withMessage("Password is required")        
	],
    readOne: [
        param("user_id")
            .exists({ checkFalsy: true })
            .withMessage("User ID is required")
    ],
    update: [
		body("user_firstname")
			.exists({ checkFalsy: true })
			.withMessage("User First Name is required"),
		body("user_lastname")
			.exists({ checkFalsy: true })
			.withMessage("User Last Name is required"),
        body("user_email")
            .exists({ checkFalsy: true })
            .withMessage("User Email is required")
            .isEmail()
            .withMessage("User Email must be a valid email address"),
        body("user_role")
            .exists({ checkFalsy: true })
            .withMessage("User Role is required"),       
        body("user_status")
            .exists({ checkFalsy: true })
            .withMessage("User Status is required"),
        param("user_id")
            .exists({ checkFalsy: true })
            .withMessage("User ID is required")
            .isNumeric()
            .withMessage("User ID must be a number")       
	],
    deleteOne: [
        param("user_id")
            .exists({ checkFalsy: true })
            .withMessage("User ID is required")
    ]
}