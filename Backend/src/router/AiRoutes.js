import { Router } from "express";
import { searchFiles } from "../controllers/AIController.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";

const router = Router();

router.post("/search", verifyJWT, searchFiles);

export default router;
