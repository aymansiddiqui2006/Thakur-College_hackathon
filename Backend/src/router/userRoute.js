import { Router } from "express";
import { RegisterUser ,loginUser,logoutUser,refreshAccessToken } from "../controller/UserRegistration.js";
import { uploadFile } from "../controller/FileUpload.js";
import { verifyJWT } from "../utils/VerifyJWT.js";
import { upload } from "../utils/multer.js";


const router = Router();

router.route("/register").post(RegisterUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

router.post("/upload", verifyJWT, upload.single("file"), uploadFile);

export default router;