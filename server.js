import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";

const app = express();

// If you use secure cookies behind Render/Proxies:
app.set("trust proxy", 1);

connectDB();

const allowedOrigins = [
  process.env.CLIENT_ORIGIN, // e.g., https://churn-client.vercel.app  (NO trailing slash)
  "http://localhost:5173", // dev
];

// Simple, exact-match CORS (good for production)
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // allow Postman/cURL
      if (allowedOrigins.includes(origin)) return cb(null, true);
      // (Optional) allow Vercel preview deployments:
      // if (/^https:\/\/.+-churn-client\.vercel\.app$/.test(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health + routes
app.get("/", (_req, res) => res.send("API is working."));
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/upload", uploadRouter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Port from Render
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server started on PORT:${port}`));
