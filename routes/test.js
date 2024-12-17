const express = require("express");
const authenticate = require("../middleware/authMiddleware"); // Import the auth middleware
const { success } = require("../utils/apiResponse");

const router = express.Router();

router.get("/protected", authenticate, (req, res) => {
    success(res, "You have accessed a protected route!", { user: req.user });
});

module.exports = router;
