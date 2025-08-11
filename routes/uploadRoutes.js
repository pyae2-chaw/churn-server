import express from "express";
import multer from "multer";
import path from "path";
import userAuth from "../middleware/userAuth.js";
import { uploadCSV } from "../controllers/uploadController.js";

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // save to /uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter to only accept CSV
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/csv") {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Upload route
router.post("/", userAuth, upload.single("file"), uploadCSV);

export default router;
