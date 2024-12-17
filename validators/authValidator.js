const { body } = require("express-validator");

const registerValidationRules = [
    body("username")
        .isString()
        .isAlphanumeric()
        .withMessage("Username must contain only alphanumeric characters")
        .isLength({ min: 4 })
        .withMessage("Username must be at least 4 characters long"),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email address"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

const loginValidationRules = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email address"),
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

module.exports = { registerValidationRules, loginValidationRules };
