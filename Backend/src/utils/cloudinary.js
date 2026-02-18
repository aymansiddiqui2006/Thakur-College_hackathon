import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ApiError from "./ApiError.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (filePath) => {
    try {
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        })

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        return response;

    } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        throw new ApiError(500, `Cloudinary upload failed: ${error.message}`);
    }
}

