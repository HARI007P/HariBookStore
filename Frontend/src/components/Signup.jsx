// src/components/Signup.jsx
import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
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

  // OTP input handling
  const handleOTPChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
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
        localStorage.setItem("justSignedUp", "true"); // 🔑 trigger Home refresh
        toast.success("Signup successful 🎉");
        navigate(from, { replace: true });
      } else toast.error(res.data.message || "Invalid OTP");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally { setLoading(false); }
  };

  // Resend OTP
  const resendOTP = async () => {
    if (!userData.email || !userData.fullname) {
      toast.error("Please enter your details again");
      setStep(1);
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/otp/send", { email: userData.email, fullname: userData.fullname });
      if (res.data.success) toast.success("OTP resent to your email");
      else toast.error(res.data.message || "Failed to resend OTP");
    } catch (err) {
      toast.error(err.response?.data?.message || "Resend failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 ">
      <div className="w-full max-w-md flex flex-col gap-8">
        
        {/* Welcome + Quote */}
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold">Welcome to</h2>
          <h2 className="text-4xl font-bold text-pink-500 mt-2">HariBookStore 📚</h2>
          <p className="mt-6 text-lg text-white/90 italic">
            "A room without books is like a body without a soul." — Cicero
          </p>
        </div>

        {/* Signup / OTP Box */}
        <div className="p-8 rounded-2xl bg-black/50 backdrop-blur-md shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            {step === 1 ? "Log In" : "Verify OTP"}
          </h2>

          {step === 1 && (
            <form onSubmit={handleSubmit(handleUserSubmit)} className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  {...register("fullname", { required: true })}
                  className="w-full px-4 py-3 bg-white/20 text-white rounded-xl 
                  placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                {errors.fullname && <p className="text-xs text-red-300 mt-1">This field is required</p>}
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", { required: true })}
                  className="w-full px-4 py-3 bg-white/20 text-white rounded-xl 
                  placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                {errors.email && <p className="text-xs text-red-300 mt-1">This field is required</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold transition duration-300 ${
                  loading ? "bg-pink-300" : "bg-pink-500 hover:bg-pink-600"
                } text-white`}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); handleOTPSubmit(); }} className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm mb-3 text-center">Enter OTP</label>
                <div className="flex justify-center gap-3">
                  {otp.map((data, i) => (
                    <input
                      key={i}
                      type="text"
                      value={data}
                      onChange={(e) => handleOTPChange(e.target.value, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      ref={(el) => (inputRefs.current[i] = el)}
                      maxLength={1}
                      className="w-12 h-12 text-center text-lg font-semibold 
                      bg-white/20 text-white rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  ))}
                </div>
                {otp.join("").length < 6 && (
                  <p className="text-xs text-red-300 mt-2 text-center">Please enter 6 digits</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 py-3 rounded-xl bg-gray-500 hover:bg-gray-600 text-white transition duration-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || otp.join("").length < 6}
                  className={`w-1/2 py-3 rounded-xl font-semibold transition duration-300 ${
                    loading ? "bg-pink-300" : "bg-pink-500 hover:bg-pink-600"
                  } text-white`}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>

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
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;
