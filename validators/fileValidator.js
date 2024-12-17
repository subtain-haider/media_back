const { body } = require("express-validator");

const uploadValidationRules = [
    // validation rules for file uploads if needed (optional)
];

const shareFileValidationRules = [
    body("fileId").notEmpty().withMessage("File ID is required"),
    body("userId").notEmpty().withMessage("User ID is required"),
];

module.exports = { uploadValidationRules, shareFileValidationRules };
