// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";

const app = express();

// Behind Render proxy (needed for Secure cookies)
app.set("trust proxy", 1);

// ---------- CORS (prod, localhost, Vercel previews) ----------
const PROD_ORIGIN =
  process.env.CLIENT_ORIGIN || "https://churn-client.vercel.app"; // NO trailing slash
const LOCAL_ORIGIN = "http://localhost:5173";
// Adjust the regex if your Vercel project slug changes:
const VERCEL_PREVIEW_RE =
  /^https:\/\/churn-client-[\w-]+-pyae-kyi-thar-chaws-projects\.vercel\.app$/;

const corsOptions = {
  origin(origin, cb) {
    // allow tools/health checks without an Origin
    if (!origin) return cb(null, true);

    if (
      origin === PROD_ORIGIN ||
      origin === LOCAL_ORIGIN ||
      VERCEL_PREVIEW_RE.test(origin)
    ) {
      return cb(null, true);
    }

    console.log("CORS BLOCKED:", origin);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// (Do NOT use app.options("*", ...) on Express 5)

// ---------- Parsers ----------
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ---------- DB ----------
connectDB();

// ---------- Health/Test ----------
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.get("/", (_req, res) => res.send("API is working."));
app.get("/api/auth/test", (_req, res) => res.json({ ok: true }));

// ---------- Routes ----------
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/upload", uploadRouter);

// ---------- 404 ----------
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// ---------- Error handler (nice CORS message) ----------
app.use((err, req, res, _next) => {
  if (err?.message === "Not allowed by CORS") {
    return res
      .status(403)
      .json({ error: "CORS blocked", originTried: req.headers.origin || null });
  }
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

// ---------- Listen ----------
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server started on PORT:${port}`));
