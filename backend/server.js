import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./db/db.js";
import AuthRoute from "./routes/authRoute.js";
import UserRoute from "./routes/UserRoute.js";
import ChatRoute from "./routes/ChatRoute.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
// Routes

app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/chat", ChatRoute);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });

  console.log(frontendPath);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listingng on port ${PORT}`);
  connectDb();
});
