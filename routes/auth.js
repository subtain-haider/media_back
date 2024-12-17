const express = require("express");
const validateRequest = require("../middleware/validator");
const handleAsync = require("../controllers/baseController");
const { register, login } = require("../controllers/authController");
const { registerValidationRules, loginValidationRules } = require("../validators/authValidator");

const router = express.Router();

// Define routes
router.post(
    "/register",
    registerValidationRules, // Attach validation rules
    validateRequest, // Validate the request
    handleAsync(register) // Handle the request
);

router.post(
    "/login",
    loginValidationRules, // Attach validation rules
    validateRequest, // Validate the request
    handleAsync(login) // Handle the request
);

module.exports = router;
