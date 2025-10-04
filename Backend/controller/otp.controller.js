// Backend/controller/otp.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Resend } from "resend";

// ✅ Initialize Resend (uses HTTPS, works on Render)
const resend = new Resend(process.env.RESEND_API_KEY);

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send OTP for Signup
export const sendOTP = async (req, res) => {
  try {
    let { email, fullname, password } = req.body;

    // Trim inputs
    email = email?.trim();
    fullname = fullname?.trim();
    password = password?.trim();

    if (!email || !fullname || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, fullname, and password are required",
      });
    }

    // Check DB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: "Database not connected",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.verified) {
      return res.status(400).json({
        success: false,
        message: "User already exists and is verified. Please login.",
      });
    }

    // Generate OTP and hashes
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const passwordHash = await bcrypt.hash(password, 10);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Upsert user
    await User.findOneAndUpdate(
      { email },
      {
        fullname,
        password: passwordHash,
        otp: otpHash,
        otpExpiresAt,
        verified: false,
      },
      { upsert: true, new: true }
    );

    // ✅ Send OTP using Resend
    try {
      const result = await resend.emails.send({
        from: "HariBookStore <no-reply@haribookstore.com>",
        to: email,
        subject: "🔐 Your OTP Code - HariBookStore",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
            <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
              <h1>📚 HariBookStore</h1>
              <h2>Account Verification</h2>
              <p>Hello <strong>${fullname}</strong>!</p>
              <p>Use the OTP below to verify your account:</p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #e91e63; letter-spacing: 4px;">${otp}</span>
              </div>
              <p style="color: #999;">⏰ Expires in <strong>5 minutes</strong></p>
              <p>Need help? Contact us at <strong>customer.haribookstore@gmail.com</strong></p>
            </div>
          </div>
        `,
      });

      console.log("✅ OTP sent via Resend:", result);
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (err) {
      console.error("❌ Resend email failed:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
        error: err.message,
      });
    }
  } catch (err) {
    console.error("❌ Send OTP Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error:
        process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// ✅ Verify OTP and Complete Signup
export const verifyOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;
    email = email?.trim();
    otp = otp?.trim();

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found. Please register first." });
    }

    if (!user.otp || !user.otpExpiresAt) {
      return res
        .status(400)
        .json({ success: false, message: "No OTP found. Please request a new one." });
    }

    if (user.otpExpiresAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP. Please check your email." });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const JWT_SECRET =
      process.env.JWT_SECRET || "haribookstore_default_secret_key_2024";
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Account verified successfully! Welcome to HariBookStore 🎉",
      user: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        verified: user.verified,
      },
      token,
    });
  } catch (err) {
    console.error("❌ Verify OTP Error:", err);
    res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: err.message,
    });
  }
};
