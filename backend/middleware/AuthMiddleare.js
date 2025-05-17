import jwt from "jsonwebtoken";
import UserModel from "../Models/UserModel.js ";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(400).json({ success: false, message: "User not authorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT);
    if (!decoded) {
      res.status(400).json({ success: false, message: "Invalid token" });
    }

    const user = await UserModel.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(400).json({ success: false, message: "User not authorized" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("protect route", error);
  }
};
