const File = require("../models/File");
const User = require("../models/User");
const path = require("path");
const fs = require("fs-extra");
const { success, error } = require("../utils/apiResponse");
const mongoose = require('mongoose');
const crypto = require("crypto");

// Upload file(s) with tags
exports.uploadFiles = (req, res) => {
    if (!req.files || req.files.length === 0) {
        return error(res, "No files uploaded", 400);
    }

    const { tags } = req.body;
    const tagList = tags ? tags.split(',').map(tag => tag.trim()) : []; // Split tags into an array

    const uploadedFiles = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        tags: tagList,
        uploadedBy: req.user.id,
    }));

    File.insertMany(uploadedFiles)
        .then((files) => success(res, "Files uploaded successfully", files))
        .catch((err) => {
            console.error(err);
            error(res, "Error uploading files", 500);
        });
};

// Get files uploaded by the logged-in user
exports.getMyFiles = (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    File.find({ uploadedBy: userId }) 
        .then((files) => {
            const baseURL = `${req.protocol}://${req.get('host')}`;
            const filesWithUrl = files.map((file) => ({
                ...file._doc,
                url: `${baseURL}/uploads/${file.filename}`, // Add URL for each file
            }));
            success(res, "Files retrieved successfully", filesWithUrl);
        })
        .catch((err) => {
            console.error(err);
            error(res, "Error retrieving files", 500);
        });
};

// Generate a public link for the file
exports.generatePublicLink = (req, res) => {
    const { fileId } = req.params;

    File.findById(fileId)
        .then((file) => {
            if (!file) return error(res, "File not found", 404);

            // Generate a publicToken if it doesn't exist
            if (!file.publicToken) {
                file.publicToken = crypto.randomBytes(16).toString("hex");
                return file.save().then((updatedFile) => updatedFile);
            }

            return file;
        })
        .then((file) => {
            const fileExtension = path.extname(file.originalName); // Get file extension
            const baseURL = `${req.protocol}://${req.get("host")}`;
            const publicLink = `${baseURL}/api/files/public/${file.publicToken}${fileExtension}`; // Append extension to the public link
            success(res, "Public link generated successfully", { publicLink });
        })
        .catch((err) => {
            console.error(err);
            error(res, "Error generating public link", 500);
        });
};

// Publicly access file via token
exports.getPublicFile = (req, res) => {
    const { token } = req.params;

    File.findOne({ publicToken: token.split('.')[0] })
        .then((file) => {
            if (!file) return res.status(404).send("Invalid or expired link");

            const filePath = path.join(__dirname, "../uploads", file.filename);
            if (!fs.existsSync(filePath)) {
                return res.status(404).send("File not found on server");
            }

            const stat = fs.statSync(filePath);
            const fileSize = stat.size;
            const range = req.headers.range;

            if (range) {
                // Handle range requests
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

                const chunkSize = (end - start) + 1;
                const fileStream = fs.createReadStream(filePath, { start, end });

                res.writeHead(206, {
                    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                    "Accept-Ranges": "bytes",
                    "Content-Length": chunkSize,
                    "Content-Type": "video/mp4", // Explicit MIME type for MP4
                });

                fileStream.pipe(res);
            } else {
                // Send the full file
                res.writeHead(200, {
                    "Content-Length": fileSize,
                    "Content-Type": "video/mp4", // Explicit MIME type for MP4
                });
                fs.createReadStream(filePath).pipe(res);
            }
        })
        .catch((err) => {
            console.error("Error serving file:", err);
            res.status(500).send("Internal server error");
        });
};

// Delete a file
exports.deleteFile = async (req, res) => {
    const file = await File.findById(req.params.id);
    if (!file) {
        return error(res, "File not found", 404);
    }

    // Check if the user owns the file
    if (!file.uploadedBy.equals(req.user.id)) {
        return error(res, "You are not authorized to delete this file", 403);
    }

    // Delete the file from the filesystem
    const filePath = path.join(__dirname, "../uploads", file.filename);
    await fs.remove(filePath);

    // Delete from the database
    await file.remove();
    success(res, "File deleted successfully");
};

// Share a file with another user
exports.shareFile = async (req, res) => {
    const { fileId, userId } = req.body;

    const file = await File.findById(fileId);
    if (!file) {
        return error(res, "File not found", 404);
    }

    // Check if the user owns the file
    if (!file.uploadedBy.equals(req.user.id)) {
        return error(res, "You are not authorized to share this file", 403);
    }

    // Check if the user to share with exists
    const user = await User.findById(userId);
    if (!user) {
        return error(res, "User not found", 404);
    }

    // Add the user to the sharedWith array
    if (!file.sharedWith.includes(userId)) {
        file.sharedWith.push(userId);
        await file.save();
    }

    success(res, "File shared successfully");
};

// Get files shared with the user
// exports.getSharedFiles = async (req, res) => {
//     const { page, limit } = req.query; // Accept page and limit from query params
//     const result = await paginate(File, { sharedWith: req.user.id }, { page, limit });
//     success(res, "Shared files retrieved successfully", result);
// };
