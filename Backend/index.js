// Backend/index.js
import dotenv from "dotenv";
import path from "path";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";

import userRoutes from "./route/user.route.js";
import bookRoutes from "./route/book.route.js";
import paymentRoutes from "./route/payment.route.js";
import otpRoutes from "./route/otp.route.js";

// ------------------ Load environment variables ------------------
const envResult = dotenv.config();
console.log("🔍 Dotenv result:", envResult);
console.log("🔍 Current working directory:", process.cwd());
console.log("🔍 Environment variables loaded:");
console.log("PORT:", process.env.PORT || "4000");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "LOADED" : "NOT LOADED");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED" : "NOT LOADED");

// ------------------ Express setup ------------------
const app = express();

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ------------------ Middleware ------------------
app.use(express.json()); // <-- move this above logging
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    "https://haribookstore1.onrender.com",
    "https://haribookstore-1.onrender.com",
    "https://haribookstore-backend.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000",
    /\.onrender\.com$/
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log("📦 Body:", req.body);
  next();
});

app.use("/uploads", express.static(uploadsDir));

// ------------------ Routes ------------------
app.use("/api/user", userRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/otp", otpRoutes);

// Default route
app.get("/", (req, res) => res.send("📚 HariBookStore API is running"));

// Health check
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const stateMap = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: stateMap[dbState] || "unknown",
    environment: {
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASS: !!process.env.EMAIL_PASS,
      MONGO_URI: !!process.env.MONGO_URI
    }
  });
});

// Test OTP endpoint
app.post("/test-otp", (req, res) => res.json({ message: "Test endpoint reached", body: req.body, headers: req.headers }));

// Test email connection
app.get("/test-email", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    console.log("🔍 Testing email connection...");
    await transporter.verify();
    res.json({ success: true, message: "Email connection successful", config: { user: process.env.EMAIL_USER, passLength: process.env.EMAIL_PASS?.length || 0 } });
  } catch (error) {
    console.error("❌ Email connection failed:", error);
    res.status(500).json({ success: false, message: "Email connection failed", error: error.message, code: error.code });
  }
});

// ------------------ MongoDB Connection ------------------
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log("✅ MongoDB Atlas connected successfully");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1);
});

// ------------------ Global Error Handling ------------------
process.on("unhandledRejection", err => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    process.exit(1);
  }
});
