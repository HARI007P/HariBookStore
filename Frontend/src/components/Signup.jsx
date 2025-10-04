// src/components/Signup.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { otpService } from "../services/api"; 
import { useAuth } from "../context/AuthProvider";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaArrowRight } from "react-icons/fa";

function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const { authUser, setAuthUser, isAuthenticated } = useAuth();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification
  const [userData, setUserData] = useState({});
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(0);
  const inputRefs = useRef([]);

  const password = watch("password", "");

  // Timer countdown for OTP
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // OTP input handling
  const handleOTPChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    // Move to next input if current is filled
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    
    // Auto-submit when all 6 digits are entered
    const completedOtp = [...newOtp];
    if (completedOtp.every(digit => digit !== "") && completedOtp.join("").length === 6) {
      setTimeout(() => {
        handleOTPVerification();
      }, 500); // Small delay to show completion state
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    // Submit on Enter key if OTP is complete
    if (e.key === "Enter" && otp.join("").length === 6) {
      handleOTPVerification();
    }
  };

  // Step 1: Send OTP
  const handleSignupFormSubmit = async (data) => {
    try {
      setLoading(true);
      setUserData(data);
      const response = await otpService.sendSignupOTP({
        fullname: data.fullname,
        email: data.email,
        password: data.password
      });
      
      if (response.success) {
        toast.success("📫 OTP sent to your email! Please check your inbox.");
        setStep(2);
        setTimer(300); // 5 minutes
      } else {
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOTPVerification = async () => {
    try {
      setLoading(true);
      const response = await otpService.verifySignupOTP({
        email: userData.email,
        otp: otp.join("")
      });
      
      if (response.success) {
        setSuccess(true);
        setAuthUser(response.user);
        toast.success(response.message || "Account created successfully! Welcome to HariBookStore 🎉");
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 2000);
      } else {
        toast.error(response.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      const errorMessage = error.response?.data?.message || "OTP verification failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    try {
      setLoading(true);
      const response = await otpService.sendSignupOTP({
        fullname: userData.fullname,
        email: userData.email,
        password: userData.password
      });
      
      if (response.success) {
        toast.success("🔄 New OTP sent to your email!");
        setTimer(300); // Reset timer to 5 minutes
        setOtp(new Array(6).fill(""));
      } else {
        toast.error(response.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated()) {
    navigate(from, { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Confetti when success */}
      {success && <Confetti recycle={false} numberOfPieces={400} gravity={0.2} />}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1.1, 1, 1.1]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10"
      >
        {/* LEFT SIDE - Welcome Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center lg:text-left text-white space-y-8 px-4"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Join Our
            </h1>
            <motion.h2
              animate={{ 
                textShadow: ["0 0 10px #ec4899", "0 0 20px #ec4899", "0 0 10px #ec4899"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl md:text-5xl font-bold text-pink-400 mb-6"
            >
              HariBookStore 📚
            </motion.h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-white/90 leading-relaxed"
          >
            Start your literary journey today. Create an account to access our vast collection of books and join a community of book lovers.
          </motion.p>
          
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-lg italic text-pink-200 border-l-4 border-pink-400 pl-6"
          >
            "Books are a uniquely portable magic." 
            <footer className="text-sm mt-2 text-pink-300">— Stephen King</footer>
          </motion.blockquote>
        </motion.div>

        {/* RIGHT SIDE - Signup Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative"
        >
          <div className="p-8 md:p-10 rounded-2xl bg-black/60 backdrop-blur-xl shadow-2xl border border-white/20 relative overflow-hidden">
            {/* Form glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-blue-500/10 rounded-2xl" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-white/70">Join our community of book lovers</p>
              </motion.div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.form
                    key="signup-form"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.6 }}
                    onSubmit={handleSubmit(handleSignupFormSubmit)} 
                    className="space-y-6"
                  >
                {/* Full Name Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative"
                >
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 text-lg" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      {...register("fullname", { 
                        required: "Full name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters"
                        },
                        maxLength: {
                          value: 50,
                          message: "Name must be less than 50 characters"
                        }
                      })}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 text-white rounded-xl placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  {errors.fullname && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm mt-2 flex items-center gap-1"
                    >
                      ⚠️ {errors.fullname.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="relative"
                >
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 text-lg" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 text-white rounded-xl placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm mt-2 flex items-center gap-1"
                    >
                      ⚠️ {errors.email.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="relative"
                >
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 text-lg" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...register("password", { 
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                        }
                      })}
                      className="w-full pl-12 pr-12 py-4 bg-white/10 text-white rounded-xl placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm mt-2 flex items-center gap-1"
                    >
                      ⚠️ {errors.password.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="relative"
                >
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 text-lg" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      {...register("confirmPassword", { 
                        required: "Please confirm your password",
                        validate: value => value === password || "Passwords do not match"
                      })}
                      className="w-full pl-12 pr-12 py-4 bg-white/10 text-white rounded-xl placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm mt-2 flex items-center gap-1"
                    >
                      ⚠️ {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </motion.div>

                    {/* Send OTP Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(236, 72, 153, 0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                        loading 
                          ? "bg-pink-400 cursor-not-allowed" 
                          : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-lg hover:shadow-pink-500/30"
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          Send OTP
                          <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="otp-form"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
                      <p className="text-white/70">Enter the 6-digit code sent to</p>
                      <p className="text-pink-400 font-semibold">{userData.email}</p>
                    </div>

                    {/* OTP Input Fields */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex justify-center gap-3 mb-6"
                    >
                      {otp.map((data, i) => (
                        <motion.input
                          key={i}
                          type="text"
                          value={data}
                          onChange={(e) => handleOTPChange(e.target.value, i)}
                          onKeyDown={(e) => handleKeyDown(e, i)}
                          ref={(el) => (inputRefs.current[i] = el)}
                          maxLength={1}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className={`w-12 h-12 text-center text-lg font-semibold bg-white/10 text-white rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-300 backdrop-blur-sm ${
                            data ? "border-pink-400 bg-pink-500/20" : "border-white/20 hover:border-white/40"
                          }`}
                        />
                      ))}
                    </motion.div>

                    {/* Timer */}
                    {timer > 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-white/80"
                      >
                        <p className="text-sm">
                          Resend code in{" "}
                          <span className="font-bold text-pink-400 animate-pulse">
                            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
                          </span>
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                      >
                        <p className="text-sm text-white/70 mb-3">
                          Didn't receive the code?
                        </p>
                        <button
                          type="button"
                          onClick={resendOTP}
                          disabled={loading}
                          className="text-pink-400 hover:text-pink-300 font-semibold transition-colors hover:underline disabled:opacity-50"
                        >
                          Resend OTP
                        </button>
                      </motion.div>
                    )}

                    {/* OTP Status */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-center mb-4"
                    >
                      <p className="text-sm text-white/60">
                        {otp.join("").length === 0 && "Enter the 6-digit code"}
                        {otp.join("").length > 0 && otp.join("").length < 6 && `${otp.join("").length}/6 digits entered`}
                        {otp.join("").length === 6 && "✓ Code complete - ready to verify"}
                      </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="space-y-4 pt-4">
                      {/* Main Submit Button */}
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={otp.join("").length === 6 ? { scale: 1.02, boxShadow: "0 10px 30px rgba(236, 72, 153, 0.3)" } : {}}
                        whileTap={otp.join("").length === 6 ? { scale: 0.98 } : {}}
                        
                        type="button"
                        onClick={handleOTPVerification}
                        disabled={loading || otp.join("").length < 6}
                        className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 text-lg ${
                          loading 
                            ? "bg-pink-400 cursor-not-allowed" 
                            : success
                            ? "bg-green-500"
                            : otp.join("").length < 6
                            ? "bg-gray-500 cursor-not-allowed opacity-50"
                            : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-lg hover:shadow-pink-500/30"
                        }`}
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Verifying OTP...
                          </>
                        ) : success ? (
                          <>
                            ✓ Account Created! 🎉
                          </>
                        ) : (
                          <>
                            {otp.join("").length < 6 ? "Enter Complete OTP" : "Verify & Create Account"}
                            <FaArrowRight className={otp.join("").length === 6 ? "animate-pulse" : ""} />
                          </>
                        )}
                      </motion.button>

                      {/* Back Button */}
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setOtp(new Array(6).fill(""));
                          setTimer(0);
                        }}
                        className="w-full py-3 rounded-xl bg-gray-600/50 hover:bg-gray-600 text-white font-medium transition-all duration-300 border border-gray-500/50 hover:border-gray-400"
                      >
                        ← Back to Form
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Link - Only show on first step */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="text-center pt-6 border-t border-white/20 mt-8"
                >
                  <p className="text-white/70">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-pink-400 hover:text-pink-300 font-semibold transition-colors hover:underline"
                    >
                      Sign In
                    </Link>
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Signup;
