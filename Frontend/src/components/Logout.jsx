import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSignOutAlt, FaSpinner } from "react-icons/fa";

function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      logout();
      toast.success("Logged out successfully! See you soon! 👋");
      
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-300 shadow-md hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <>
          <FaSpinner className="animate-spin" />
          <span>Logging out...</span>
        </>
      ) : (
        <>
          <FaSignOutAlt />
          <span>Logout</span>
        </>
      )}
    </motion.button>
  );
}

export default Logout;
