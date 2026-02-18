import multer from "multer";

// Store files temporarily before sending to Cloudinary
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/temp"); // temporary folder
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// Only allow certain file types & max size 20MB
export const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only PDF, PPT, and image files are allowed"));
        }
        cb(null, true);
    }
});
