// Backend/index.js
import dotenv from "dotenv";
import path from "path";
// Load environment variables FIRST before other imports
const envResult = dotenv.config();
console.log("🔍 Dotenv result:", envResult);
console.log("🔍 Current working directory:", process.cwd());
console.log("🔍 Environment variables loaded:");
console.log("PORT:", process.env.PORT);
console.log("EMAIL_USER:", process.env.EMAIL_USER ? 'LOADED' : 'NOT LOADED');
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? 'LOADED' : 'NOT LOADED');

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

const app = express();

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: [
    "https://haribookstore1.onrender.com", // Current frontend URL
    "https://haribookstore-1.onrender.com", // Old frontend URL
    "https://haribookstore-backend.onrender.com", // Backend URL for testing
    "http://localhost:5173", // Local development
    "http://localhost:3000", // Alternative local development
    /\.onrender\.com$/ // Allow all onrender.com subdomains
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log(`📦 Body:`, req.body);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/otp", otpRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("📚 HariBookStore API is running");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    environment: {
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASS: !!process.env.EMAIL_PASS,
      MONGO_URI: !!process.env.MONGO_URI
    }
  });
});

// Test OTP endpoint (for debugging)
app.post("/test-otp", (req, res) => {
  res.json({
    message: "Test endpoint reached",
    body: req.body,
    headers: req.headers
  });
});

// Test email connection endpoint
app.get("/test-email", async (req, res) => {
  try {
    const transporter = nodemailer.createTransporter({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    console.log('🔍 Testing email connection...');
    await transporter.verify();
    
    res.json({
      success: true,
      message: "Email connection successful",
      config: {
        user: process.env.EMAIL_USER,
        passLength: process.env.EMAIL_PASS?.length || 0
      }
    });
  } catch (error) {
    console.error('❌ Email connection failed:', error);
    res.status(500).json({
      success: false,
      message: "Email connection failed",
      error: error.message,
      code: error.code
    });
  }
});

// Config
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // optional: timeout after 5s
};

// Connect to MongoDB Atlas
mongoose
  .connect(MONGO_URI, mongooseOptions)
  .then(() => {
    console.log("✅ MongoDB Atlas connected successfully");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // stop the app if DB connection fails
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

// Optional: Graceful shutdown
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
