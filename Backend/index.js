// Backend/index.js
import dotenv from "dotenv";
import path from "path";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";

// Load environment variables
const envResult = dotenv.config();
console.log("🔍 Dotenv result:", envResult);
console.log("🔍 Current working directory:", process.cwd());
console.log("🔍 Environment variables loaded:");
console.log("PORT:", process.env.PORT);
console.log("EMAIL_USER:", process.env.EMAIL_USER ? 'LOADED' : 'NOT LOADED');
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? 'LOADED' : 'NOT LOADED');

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
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://haribookstore-1.onrender.com",
    "https://haribookstore07.onrender.com",
    /\.onrender\.com$/
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/otp", otpRoutes);

// Serve React frontend
const frontendPath = path.join(__dirname, "../frontend/dist"); // adjust path if needed
app.use(express.static(frontendPath));

// React routing fallback - for refresh or unknown routes
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(frontendPath, "index.html"));
  } else {
    res.status(404).json({ error: "API route not found" });
  }
});

// MongoDB connection
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("✅ MongoDB Atlas connected successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
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
