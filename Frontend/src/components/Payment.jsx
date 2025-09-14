// src/components/Payment.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { paymentService } from "../services/api";
import { useAuth } from "../context/AuthProvider";
import qrImage from "../assets/upi.jpeg";
import { FaArrowLeft, FaClock, FaMapMarkerAlt, FaPhone, FaUser, FaEnvelope } from "react-icons/fa";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useAuth();
  const { bookname, bookcode } = location.state || {};
  
  // Form states
  const [formData, setFormData] = useState({
    customerName: authUser?.fullname || "",
    customerEmail: authUser?.email || "",
    mobile: "",
    village: "",
    district: "",
    pincode: "",
    state: "",
    bookCode: bookcode || "",
    utr: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes for payment
  
  // Book pricing
  const BOOK_PRICE = 1;
  const DELIVERY_CHARGE = 34;
  const TOTAL_AMOUNT = BOOK_PRICE + DELIVERY_CHARGE; // ₹35

  // Redirect if not authenticated
  useEffect(() => {
    if (!authUser) {
      toast.error("Please login to make a purchase");
      navigate("/login");
      return;
    }
    if (!bookname || !bookcode) {
      toast.error("Invalid book selection");
      navigate("/course");
      return;
    }
  }, [authUser, bookname, bookcode, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error("⏱ Payment session expired");
      navigate("/course");
      return;
    }
    
    const interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    
    // Warnings at specific intervals
    if (timeLeft === 300) toast.warning("⏰ 5 minutes remaining!");
    if (timeLeft === 120) toast.warning("⚠️ Only 2 minutes left!");
    if (timeLeft === 30) toast.error("⚡ Only 30 seconds left!");
    
    return () => clearInterval(interval);
  }, [timeLeft, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    const { customerName, customerEmail, mobile, village, district, pincode, state, bookCode, utr } = formData;
    
    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    
    if (!customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return false;
    }
    
    if (!village.trim()) {
      toast.error("Please enter your village/area");
      return false;
    }
    
    if (!district.trim()) {
      toast.error("Please enter your district");
      return false;
    }
    
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    
    const allowedStates = ['Andhra Pradesh', 'Telangana', 'Odisha'];
    if (!allowedStates.includes(state)) {
      toast.error("Sorry, we only deliver to Andhra Pradesh, Telangana, and Odisha");
      return false;
    }
    
    if (bookCode.trim() !== (bookcode || "").trim()) {
      toast.error("Book code doesn't match. Please verify.");
      return false;
    }
    
    if (!/^\d{12}$/.test(utr)) {
      toast.error("UTR number must be exactly 12 digits");
      return false;
    }
    
    return true;
  };

  const handlePaymentSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const orderData = {
        ...formData,
        bookName: bookname,
        amount: TOTAL_AMOUNT
      };
      
      const response = await paymentService.processPayment(orderData);
      
      if (response.success) {
        toast.success("🎉 Order placed successfully! You will receive a confirmation email shortly.");
        setTimeout(() => {
          navigate("/books", {
            state: {
              orderSuccess: true,
              orderId: response.orderId
            }
          });
        }, 2000);
      } else {
        toast.error(response.message || "Failed to place order. Please try again.");
      }
      
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage = error.response?.data?.message || "Payment failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity } }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1.1, 1, 1.1] }}
          transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, scale: { duration: 5, repeat: Infinity } }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate("/books")}
            className="flex items-center gap-2 text-white hover:text-pink-400 transition-colors duration-300"
          >
            <FaArrowLeft className="text-2xl" />
            <span className="text-lg font-semibold">Back to Books</span>
          </button>
          
          <div className="flex items-center gap-2 bg-red-600/20 px-4 py-2 rounded-full border border-red-500/50">
            <FaClock className="text-red-400" />
            <span className="text-red-400 font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl md:text-5xl font-bold text-center mb-8"
        >
          Complete Your <span className="text-pink-400">Order</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Payment QR Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-pink-400">📱 Payment Details</h2>
            
            {/* Book Info */}
            <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-lg mb-2">📚 {bookname}</h3>
              <p className="text-pink-300">Book Code: {bookcode}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Book Price:</span>
                  <span>₹{BOOK_PRICE}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>₹{DELIVERY_CHARGE}</span>
                </div>
                <div className="border-t border-pink-500/30 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg text-pink-400">
                    <span>Total Amount:</span>
                    <span>₹{TOTAL_AMOUNT}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center">
              <p className="text-lg mb-4">
                <strong className="text-pink-400">UPI ID:</strong> 
                <span className="bg-pink-500/20 px-3 py-1 rounded ml-2 font-mono">7416219267@ybl</span>
              </p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <img src={qrImage} alt="Scan to Pay" className="w-64 h-64 object-contain" />
              </div>
              <p className="text-sm text-gray-300 mt-4">
                Scan QR code or pay to UPI ID above with amount ₹{TOTAL_AMOUNT}
              </p>
            </div>
          </motion.div>

          {/* Order Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-pink-400">📝 Order Information</h2>
            
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
                <input
                  type="text"
                  name="customerName"
                  placeholder="Your Full Name"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 text-white rounded-lg placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
                <input
                  type="email"
                  name="customerEmail"
                  placeholder="Your Email Address"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 text-white rounded-lg placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number (10 digits)"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 text-white rounded-lg placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Address Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
                  <input
                    type="text"
                    name="village"
                    placeholder="Village/Area"
                    value={formData.village}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 text-white rounded-lg placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
                
                <input
                  type="text"
                  name="district"
                  placeholder="District"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 text-white rounded-lg placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode (6 digits)"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  maxLength={6}
                  className="w-full px-4 py-3 bg-white/10 text-white rounded-lg placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="" className="bg-gray-800">Select State</option>
                  <option value="Andhra Pradesh" className="bg-gray-800">Andhra Pradesh</option>
                  <option value="Telangana" className="bg-gray-800">Telangana</option>
                  <option value="Odisha" className="bg-gray-800">Odisha</option>
                </select>
              </div>

              {/* Book Code Verification */}
              <input
                type="text"
                name="bookCode"
                placeholder="Confirm Book Code"
                value={formData.bookCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 text-white rounded-lg placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />

              {/* UTR Number */}
              <input
                type="text"
                name="utr"
                placeholder="UTR Number (12 digits)"
                value={formData.utr}
                onChange={handleInputChange}
                maxLength={12}
                className="w-full px-4 py-3 bg-white/10 text-white rounded-lg placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                💡 UTR is the 12-digit transaction reference number you get after payment
              </p>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePaymentSubmit}
                disabled={loading}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-lg hover:shadow-pink-500/30"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  "🛒 Complete Order - ₹" + TOTAL_AMOUNT
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Delivery Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-green-500/10 border border-green-500/30 rounded-lg p-6 max-w-4xl mx-auto"
        >
          <h3 className="text-xl font-bold text-green-400 mb-4">🚚 Delivery Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold text-green-300">📍 Delivery Areas:</p>
              <p className="text-gray-300">Andhra Pradesh, Telangana, Odisha only</p>
            </div>
            <div>
              <p className="font-semibold text-green-300">⏱ Delivery Time:</p>
              <p className="text-gray-300">Within 3 working days</p>
            </div>
            <div>
              <p className="font-semibold text-green-300">✅ Verification:</p>
              <p className="text-gray-300">UTR verified before dispatch</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Payment;
