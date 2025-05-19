import jwt from "jsonwebtoken";
import UserModel from "../Models/UserModel.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Get user
    const user = await UserModel.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("protectRoute error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
