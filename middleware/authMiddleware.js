const jwt = require("jsonwebtoken");
const { error } = require("../utils/apiResponse");

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header

    if (!token) {
        return error(res, "Access denied. No token provided.", 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = decoded; // Attach the decoded token payload (user details) to the request
        next(); // Move to the next middleware or route handler
    } catch (err) {
        return error(res, "Invalid or expired token.", 403);
    }
};

module.exports = authenticate;
