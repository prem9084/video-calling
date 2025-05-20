import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./db/db.js";
import AuthRoute from "./routes/authRoute.js";
import UserRoute from "./routes/UserRoute.js";
import ChatRoute from "./routes/ChatRoute.js";
import path from "path";
import morgan from "morgan";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

// Routes
app.use(
  cors({
    origin: ["http://localhost:5173", "https://g-meeting.netlify.app"],
    credentials: true, // allow frontend to send cookies
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/chat", ChatRoute);



app.listen(PORT, () => {
  console.log(`Server listingng on port ${PORT}`);
  connectDb();
});
