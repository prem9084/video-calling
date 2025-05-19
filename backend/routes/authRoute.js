import express from "express";
import {
  onboard,
  userLogin,
  userRegister,
} from "../controllers/AuthController.js";
import { protectRoute } from "../middleware/AuthMiddleare.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
// router.post("/logout", userLogout);

router.post("/onboard", protectRoute, onboard);

// check user login or not
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
