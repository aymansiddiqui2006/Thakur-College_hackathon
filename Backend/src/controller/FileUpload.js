import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { File } from "../models/file.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const uploadFile = asyncHandler(async (req, res) => {
    const user = req.user;

    if (user.role !== "faculty") {
        throw new ApiError(403, "Forbidden: Only faculty members can upload files");
    }

    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }

    const cloudinaryRes = await uploadToCloudinary(req.file.path);
    if (!cloudinaryRes || !cloudinaryRes.secure_url) {
        throw new ApiError(500, "Failed to upload file to cloud storage");
    }

    const { title, description, keyword, type, branch, semester, subject } = req.body;

    if (!title || !type || !branch || !semester || !subject || !keyword || !Array.isArray(keyword) || keyword.length === 0) {
        throw new ApiError(400, "Missing required fields: title, type, branch, semester, subject and keyword (array) are required");
    }

    const fileData = await File.create({
        title,
        description,
        keyword,
        type,
        branch,
        semester,
        subject,
        uploadedBy: user._id,
        fileUrl: cloudinaryRes.secure_url,
        cloudinaryId: cloudinaryRes.public_id
    });


    res.status(201).json(new ApiResponse(201, { fileUrl: cloudinaryRes.secure_url, fileData }, "File uploaded successfully"));

}
)

export { uploadFile };