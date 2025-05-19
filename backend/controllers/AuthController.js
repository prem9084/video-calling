import jwt from "jsonwebtoken";
import UserModel from "../Models/UserModel.js";
import { upsertStreamUser } from "../db/Stream.js";

// Regiter
export const userRegister = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is Required" });
    }
    if (!fullname) {
      return res.json({ success: false, message: "fullname is Required" });
    }
    if (!password) {
      return res.json({ success: false, message: "Password is Required" });
    }

    if (password.length < 6) {
      return res.json({
        success: false,
        message: "Password must be Greater than 6 characters",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "Email Already Registered",
      });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await UserModel.create({
      fullname,
      email,
      password,
      profilePic: randomAvatar,
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullname,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created ${newUser.fullname}`);
    } catch (streamError) {
      console.error("Error creating stream user:", streamError);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    res.status(200).json({ success: true, newUser, message: "User Created" });
  } catch (error) {
    console.error("Server error during registration:", error);
    res.json({
      success: false,
      message: "Something went wrong during registration",
      error: error.message,
    });
  }
};

// Login

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and Password is required",
      });
    }
    // check eisting user

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User is not register with this email id",
      });
    }

    const isMetch = await user.matchPassword(password);

    if (!isMetch) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    res.status(200).json({ success: true, user, message: "User loggedIn" });
  } catch (error) {
    console.log(error);
  }
};

export const userLogout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "User logout Successfully" });
};

export const onboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullname, bio, learningLanguage, nativeLanguage, location } =
      req.body;

    if (
      !fullname ||
      !bio ||
      !learningLanguage ||
      !nativeLanguage ||
      !location
    ) {
      return res.json({
        success: false,
        message: "All fields is required",
        missingFields: [
          !fullname && "fullname",
          !bio && "bio",
          !learningLanguage && "learningLanguage",
          !nativeLanguage && "nativeLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullname,
        image: updatedUser.profilePic,
      });
      console.log(
        `Stream user updated after onboading for ${updatedUser.fullname}`
      );
    } catch (streamError) {
      console.log(streamError);
      res.json(
        "Error updating Stream user during onBoarding",
        streamError.message
      );
    }

    if (!updatedUser) return res.json({ message: "User not found" });

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Onbording Completed",
    });
  } catch (error) {
    console.log(error);
  }
};
