const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const corsConfig = require("./config/corsConfig");

dotenv.config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/test");
const fileRoutes = require("./routes/file");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
const path = require('path');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(corsConfig);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/files", fileRoutes);

// Handle 404
app.use(notFound);

// Error Handling
app.use(errorHandler);

// Serve static files (uploaded files) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/api/test-video", (req, res) => {
    const filePath = path.join(__dirname, "../uploads/1734438526087-220307751-videos_3.mp4");
    res.sendFile(filePath);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
