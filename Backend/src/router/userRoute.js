import { Router } from "express";
import { RegisterUser ,loginUser,logoutUser,refreshAccessToken } from "../controller/UserRegistration.js";
const router = Router();

router.route("/register").post(RegisterUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;