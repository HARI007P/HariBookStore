// Backend/controller/otp.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

// ✅ Configure Nodemailer (Gmail + App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send OTP for Signup
export const sendOTP = async (req, res) => {
  try {
    let { email, fullname, password } = req.body;
    email = email?.trim();
    fullname = fullname?.trim();
    password = password?.trim();

    if (!email || !fullname || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, fullname, and password are required",
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: "Database not connected",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.verified) {
      return res.status(400).json({
        success: false,
        message: "User already exists and is verified. Please login.",
      });
    }

    // Generate and hash OTP & password
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const passwordHash = await bcrypt.hash(password, 10);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

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

    // ✅ Send email with Nodemailer
    const mailOptions = {
      from: `"HariBookStore" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Your OTP Code - HariBookStore",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; background:#f3f3f3; border-radius:10px;">
          <div style="background:#fff; padding:30px; border-radius:8px; text-align:center;">
            <h2>📚 Welcome to HariBookStore!</h2>
            <p>Hello <strong>${fullname}</strong>,</p>
            <p>Use this OTP to verify your account:</p>
            <div style="font-size:32px; font-weight:bold; color:#e91e63; margin:20px 0;">${otp}</div>
            <p>This OTP expires in <strong>5 minutes</strong>.</p>
            <p>If you didn’t request this, ignore this email.</p>
            <p>– HariBookStore Team</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ OTP sent to ${email}`);
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (err) {
    console.error("❌ Send OTP Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: err.message,
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

    const JWT_SECRET = process.env.JWT_SECRET || "haribookstore_default_secret";
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Account verified successfully!",
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
