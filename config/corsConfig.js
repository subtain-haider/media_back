const cors = require("cors");

const allowedDomains = [
    "http://localhost:3000", // Example: Local React app
    "http://164.92.192.18",   // Example: Production frontend
];

const corsOptions = {
    origin: "*", // Allow all origins for public files
    methods: ["GET"],
    credentials: false, // No cookies for public file access
};

module.exports = cors(corsOptions);
