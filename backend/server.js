import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./db/db.js";
import AuthRoute from "./routes/authRoute.js";
import UserRoute from "./routes/UserRoute.js";
import ChatRoute from "./routes/ChatRoute.js";

const app = express();

dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://meetting.netlify.app/"], // your frontend URL
    credentials: true,
  })
);
app.use(cookieParser());
// Routes

app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/chat", ChatRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listingng on port ${PORT}`);
  connectDb();
});
