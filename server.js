import cors from "cors";
import express from "express";

const app = express();
app.set("trust proxy", 1);

// 🔎 Temporary log to see exactly what Origin the server receives
app.use((req, _res, next) => {
  if (req.headers.origin && req.method !== "OPTIONS") {
    console.log(
      "Origin:",
      req.headers.origin,
      "→",
      req.method,
      req.originalUrl
    );
  }
  next();
});

// ✅ Allow your production Vercel domain, localhost, and preview URLs
const prod = "https://churn-client.vercel.app"; // NO trailing slash
const local = "http://localhost:5173";
const vercelPreview =
  /^https:\/\/churn-client-[\w-]+-pyae-kyi-thar-chaws-projects\.vercel\.app$/;

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // allow curl/Postman/health
    if (origin === prod || origin === local) return cb(null, true);
    if (vercelPreview.test(origin)) return cb(null, true); // allow Vercel previews
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight

app.use(express.json());
