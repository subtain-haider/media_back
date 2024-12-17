const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
    {
            filename: { type: String, required: true },
            originalName: { type: String, required: true },
            mimeType: { type: String, required: true },
            size: { type: Number, required: true },
            tags: [{ type: String }], 
            uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
            publicToken: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
