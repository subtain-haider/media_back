const cors = require("cors");

const allowedDomains = [
    "http://localhost:3000", // Example: Local React app
    "http://164.92.192.18",   // Example: Production frontend
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g., mobile apps or Postman)
        if (!origin || allowedDomains.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
};

module.exports = cors(corsOptions);
