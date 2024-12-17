const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests
    message: { status: "error", message: "Too many requests. Please try again later." },
});

module.exports = apiLimiter;
