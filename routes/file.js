const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validator");
const handleAsync = require("../controllers/baseController");
const { uploadValidationRules, shareFileValidationRules } = require("../validators/fileValidator");
const {
    uploadFiles,
    getMyFiles,
    deleteFile,
    shareFile,
    getSharedFiles,
    generatePublicLink,
    getPublicFile
} = require("../controllers/fileController");

const upload = require("../config/multerConfig");

const router = express.Router();

// Define routes
router.post(
    "/upload",
    authenticate, // Ensure the user is logged in
    upload.array("files"), // Handle multiple file uploads
    validateRequest, // Validate request if needed (optional)
    handleAsync(uploadFiles) // Handle upload
);

router.get(
    "/my-files",
    authenticate,
    handleAsync(getMyFiles) // Retrieve files owned by the user
);

// Route to generate a public link
router.post("/generate-link/:fileId", authenticate, handleAsync(generatePublicLink));

// Public access to file
router.get("/public/:token", handleAsync(getPublicFile));

router.delete(
    "/delete/:id",
    authenticate,
    handleAsync(deleteFile) // Delete a file owned by the user
);

router.post(
    "/share",
    authenticate,
    shareFileValidationRules, // Validate the share request
    validateRequest,
    handleAsync(shareFile) // Share a file with another user
);

router.get(
    "/shared-with-me",
    authenticate,
    handleAsync(getSharedFiles) // Retrieve files shared with the user
);

module.exports = router;
