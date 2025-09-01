// src/components/Signup.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { api } from "../services/api";

function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  // Timer state
  const [timer, setTimer] = useState(0); 
  const [success, setSuccess] = useState(false);

  // Countdown
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
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Send OTP
  const handleUserSubmit = async (data) => {
    try {
      setLoading(true);
      setUserData(data);
      const res = await api.post("/otp/send", { email: data.email, fullname: data.fullname });
      if (res.data.success) {
        toast.success("OTP sent to your email");
        setStep(2);
        setTimer(180);
      } else toast.error(res.data.message || "Failed to send OTP");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    } finally { setLoading(false); }
  };

  // Verify OTP
  const handleOTPSubmit = async () => {
    try {
      setLoading(true);
      const res = await api.post("/otp/verify", {
        fullname: userData.fullname,
        email: userData.email,
        otp: otp.join(""),
      });
      if (res.data.success) {
        localStorage.setItem("Users", JSON.stringify(res.data.user));
        localStorage.setItem("justSignedUp", "true");
        setSuccess(true);
        toast.success("Signup successful 🎉");
        setTimeout(() => navigate(from, { replace: true }), 3000);
      } else toast.error(res.data.message || "Invalid OTP");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally { setLoading(false); }
  };

  const resendOTP = async () => {
    if (!userData.email || !userData.fullname) {
      toast.error("Please enter your details again");
      setStep(1);
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/otp/send", { email: userData.email, fullname: userData.fullname });
      if (res.data.success) {
        toast.success("OTP resent to your email");
        setTimer(180);
      } else toast.error(res.data.message || "Failed to resend OTP");
    } catch (err) {
      toast.error(err.response?.data?.message || "Resend failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* 🎊 Confetti when success */}
      {success && <Confetti recycle={false} numberOfPieces={400} gravity={0.2} />}

      <motion.div 
        whileHover={{ rotateY: 3, rotateX: 3 }}
        transition={{ type: "spring", stiffness: 150 }}
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
      >
        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="text-center lg:text-left text-white space-y-6 px-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold">Welcome to</h2>
          <motion.h2
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-4xl md:text-6xl font-bold text-pink-400"
          >
            HariBookStore 📚
          </motion.h2>
          <p className="mt-6 text-lg md:text-xl italic text-white/90">
            "A room without books is like a body without a soul." — Cicero
          </p>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="p-8 rounded-2xl bg-black/60 backdrop-blur-xl shadow-2xl border border-white/20 relative"
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="form-step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
                onSubmit={handleSubmit(handleUserSubmit)}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white text-center mb-6">Sign Up / Log In</h2>
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("fullname", { required: true })}
                  className="w-full px-4 py-3 bg-white/20 text-white rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                {errors.fullname && <p className="text-xs text-red-300 mt-1">This field is required</p>}

                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: true })}
                  className="w-full px-4 py-3 bg-white/20 text-white rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                {errors.email && <p className="text-xs text-red-300 mt-1">This field is required</p>}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl font-semibold transition duration-300 ${
                    loading ? "bg-pink-300" : "bg-pink-500 hover:bg-pink-600"
                  } text-white shadow-lg`}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="form-step2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.6 }}
                onSubmit={(e) => { e.preventDefault(); handleOTPSubmit(); }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white text-center mb-6">Verify OTP</h2>
                <div className="flex justify-center gap-3">
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
                      className="w-12 h-12 text-center text-lg font-semibold bg-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/2 py-3 rounded-xl bg-gray-500 hover:bg-gray-600 text-white transition duration-300"
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={success ? { scale: [1, 1.2, 1], backgroundColor: "#22c55e" } : {}}
                    transition={{ duration: 0.6 }}
                    type="submit"
                    disabled={loading || otp.join("").length < 6}
                    className={`w-1/2 py-3 rounded-xl font-semibold transition duration-300 ${
                      loading ? "bg-pink-300" : "bg-pink-500 hover:bg-pink-600"
                    } text-white shadow-lg`}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </motion.button>
                </div>

                {/* Timer */}
                {timer > 0 ? (
                  <motion.p 
                    key="timer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-white/80 mt-3 text-center"
                  >
                    Resend OTP in{" "}
                    <span className="font-bold text-pink-400 animate-pulse">
                      {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
                    </span>
                  </motion.p>
                ) : (
                  <p className="text-sm text-white/80 mt-3 text-center">
                    Didn't receive OTP?{" "}
                    <button
                      type="button"
                      onClick={resendOTP}
                      disabled={loading}
                      className="text-pink-300 hover:underline"
                    >
                      Resend OTP
                    </button>
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Signup;
