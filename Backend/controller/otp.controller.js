// Backend/controller/otp.controller.js
import User from "../models/user.model.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Hardcode Gmail & App Password (⚠️ only for testing, not production)
const EMAIL_USER = "hari07102004p@gmail.com";
const EMAIL_PASS = "vrfselkrhtshhcua"; // exactly 16 chars

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send OTP for Signup
export const sendOTP = async (req, res) => {
  const { email, fullname, password } = req.body;

  if (!email || !fullname || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email, fullname, and password are required" });
  }

  // Check if user already exists and is verified
  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser.verified) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists. Please login instead." });
  }

  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);
  const passwordHash = await bcrypt.hash(password, 10);
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  try {
    await User.findOneAndUpdate(
      { email },
      { 
        fullname, 
        password: passwordHash,
        otp: otpHash, 
        otpExpiresAt, 
        verified: false 
      },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: `"HariBookStore OTP" <${EMAIL_USER}>`,
      to: email,
      subject: "🔐 Your Account Verification Code - HariBookStore",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #333; margin-bottom: 10px;">📚 HariBookStore</h1>
              <h2 style="color: #666; font-weight: normal;">Account Verification</h2>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Hello <strong>${fullname}</strong>!</p>
              <p style="color: #666; margin-bottom: 20px;">Welcome to HariBookStore! Please use the verification code below to complete your account setup:</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #e91e63; letter-spacing: 4px;">${otp}</span>
              </div>
              
              <p style="color: #999; font-size: 14px;">⏰ This code expires in <strong>5 minutes</strong></p>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
              <p style="color: #666; font-size: 14px; margin-bottom: 10px;">Thank you for joining our community of book lovers!</p>
              <p style="color: #999; font-size: 12px;">Need help? Contact us at <strong>customer.haribookstore@gmail.com</strong></p>
            </div>
          </div>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ Send OTP Error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// ✅ Verify OTP and Complete Signup
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !user.otp) {
      return res
        .status(400)
        .json({ success: false, message: "User not found or OTP missing" });
    }

    if (user.otpExpiresAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired" });
    }

    // ✅ Compare OTP with hash
    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    // ✅ Mark user as verified and complete signup
    user.verified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET || "haribookstore_default_secret_key_2024";
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Account created successfully! Welcome to HariBookStore! 🎉",
      user: { 
        _id: user._id, 
        email: user.email, 
        fullname: user.fullname,
        verified: user.verified 
      },
      token
    });
  } catch (err) {
    console.error("❌ Verify OTP Error:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};