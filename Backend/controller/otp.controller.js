// Backend/controller/otp.controller.js
import User from "../models/user.model.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

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

// ✅ Send OTP
export const sendOTP = async (req, res) => {
  const { email, fullname } = req.body;

  if (!email || !fullname) {
    return res
      .status(400)
      .json({ success: false, message: "Email & fullname required" });
  }

  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  try {
    await User.findOneAndUpdate(
      { email },
      { fullname, otp: otpHash, otpExpiresAt, verified: false },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: `"Bookstore OTP" <${EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <h3>Hello ${fullname}</h3>
        <p>Your OTP is: <b>${otp}</b></p>
        <p>Expires in 5 minutes.</p>
        <br>
        <p>Thank you for using HariBookStore!</p>
        <br>
        <p>For support, reach out: <b>customer.haribookstore@gmail.com</b></p>
      `,
    });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ Send OTP Error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// ✅ Verify OTP (Only OTP, no password)
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email & OTP required" });
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

    // ✅ Mark user as verified
    user.verified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user: { id: user._id, email: user.email, fullname: user.fullname },
    });
  } catch (err) {
    console.error("❌ Verify OTP Error:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};
