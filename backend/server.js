import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./db/db.js";
import AuthRoute from "./routes/authRoute.js";
import UserRoute from "./routes/UserRoute.js";
import ChatRoute from "./routes/ChatRoute.js";
import path from "path";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

// Routes
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow frontend to send cookies
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/chat", ChatRoute);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(_dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(_dirname, "../frontend", "dist", "index.html"));
//   });
// }

app.listen(PORT, () => {
  console.log(`Server listingng on port ${PORT}`);
  connectDb();
});
