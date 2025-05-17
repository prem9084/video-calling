import express from "express";

import { protectRoute } from "../middleware/AuthMiddleare.js";
import { getStreamToken } from "../controllers/ChatController.js";

const router = express.Router();
router.get("/token", protectRoute, getStreamToken);

export default router;
