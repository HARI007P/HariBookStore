import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Utility to create JWT
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "default_secret", {
    expiresIn: "1d",
  });
};

// SIGNUP ONLY
export const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Input validation
    if (!fullname || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Full name, email, and password are required" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters long" 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists. Please login instead." 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      verified: true, // Direct signup should be verified
    });

    const token = createToken(newUser._id);

    const user = {
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
    };

    res.status(201).json({ 
      success: true, 
      message: "Account created successfully! Welcome to HariBookStore! 🎉",
      user, 
      token 
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error. Please try again." 
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Check if user is verified (created through OTP)
    if (!user.verified) {
      return res.status(400).json({ success: false, message: "Please verify your account first" });
    }

    // Check if user has a password (some users might be created through OTP without direct signup)
    if (!user.password) {
      return res.status(400).json({ success: false, message: "Account not properly set up. Please contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = createToken(user._id);

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
    };

    res.status(200).json({ success: true, user: userData, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
