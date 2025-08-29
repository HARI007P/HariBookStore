import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./home/Home";
import Courses from "./courses/Courses";
import Signup from "./components/Signup";
import About from "./components/About";
import Contact from "./components/Contact";
import Payment from "./components/Payment";
import PrivacyPolicy from "./components/Policy";
import TermsAndConditions from "./components/TermsAndConditions";

import { useAuth } from "./context/AuthProvider";
import Background from "./assets/book10.jpg"; // Ensure this path is correct

function App() {
  const [authUser] = useAuth(); // Only need the user value

  return (
    <div
      className="relative min-h-screen text-gray-200 dark:text-white"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-0"></div>

      {/* Content Wrapper */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Protected Route for Courses */}
          <Route
            path="/course"
            element={authUser ? <Courses /> : <Navigate to="/signup" replace />}
          />

          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toast Notifications */}
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </div>
  );
}

export default App;
