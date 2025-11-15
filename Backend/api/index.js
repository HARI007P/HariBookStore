// backend/api/index.js
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import serverless from "serverless-http";

import userRoutes from "../route/user.route.js";
import bookRoutes from "../route/book.route.js";
import paymentRoutes from "../route/payment.route.js";
import otpRoutes from "../route/otp.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/otp", otpRoutes);

// Root API
app.get("/api", (req, res) => {
  res.json({ message: "📚 HariBookStore Serverless API is live!" });
});

// MongoDB — connect once
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB Connected");
  isConnected = true;
}

const handler = serverless(app);

export default async function apiHandler(req, res) {
  await connectDB();
  return handler(req, res);
}
