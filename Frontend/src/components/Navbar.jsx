import React, { useEffect, useState } from "react";
import Logout from "./Logout";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaSignInAlt, FaUserPlus, FaShoppingBag } from "react-icons/fa";
import Logo from "../assets/book12.gif";

function Navbar() {
  const { authUser, isAuthenticated } = useAuth();
  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const navItems = (
    <>
      <li>
        <Link to="/" className="text-lg font-medium" onClick={closeMenu}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/books" className="text-lg font-medium" onClick={closeMenu}>
          Books
        </Link>
      </li>
      <li>
        <Link to="/contact" className="text-lg font-medium" onClick={closeMenu}>
          Contact
        </Link>
      </li>
      <li>
        <Link to="/about" className="text-lg font-medium" onClick={closeMenu}>
          About
        </Link>
      </li>
      {isAuthenticated() && (
        <li>
          <Link 
            to="/orders" 
            className="flex items-center gap-2 text-lg font-medium hover:text-pink-400 transition-colors duration-300" 
            onClick={closeMenu}
          >
            <FaShoppingBag className="text-sm" />
            <span>My Orders</span>
          </Link>
        </li>
      )}
    </>
  );

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        sticky ? "bg-gray-600/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Left - Logo + Store Name */}
          <div className="flex items-center gap-2">
            <img
              src={Logo}
              alt="Bookstore Logo"
              className="h-14 w-14 sm:h-16 sm:w-16 object-contain cursor-pointer"
            />
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-2xl sm:text-3xl font-bold text-white">
                Hari's
              </span>
              <span className="text-3xl sm:text-4xl font-bold text-pink-500 sm:ml-1">
                BookStore
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <ul className="flex gap-6 text-white">{navItems}</ul>
            {isAuthenticated() ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white">
                  <FaUser className="text-pink-400" />
                  <span className="text-sm font-medium">
                    {authUser?.fullname || authUser?.email || 'User'}
                  </span>
                </div>
                <Logout />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-white hover:text-pink-400 px-3 py-2 rounded-md transition-all duration-300 border border-transparent hover:border-pink-400/50"
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-4 py-2 rounded-md transition-all duration-300 shadow-lg hover:shadow-pink-500/30"
                >
                  <FaUserPlus />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              {menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-gray-600/95 backdrop-blur-md rounded-md shadow-xl p-4 mt-2 border border-white/10"
          >
            <ul className="flex flex-col gap-4 text-white">{navItems}</ul>
            <div className="mt-4 pt-4 border-t border-white/20">
              {isAuthenticated() ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white p-2 bg-white/10 rounded-md">
                    <FaUser className="text-pink-400" />
                    <span className="text-sm">
                      {authUser?.fullname || authUser?.email || 'User'}
                    </span>
                  </div>
                  <Logout />
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 w-full text-white border border-pink-400/50 hover:bg-pink-400/10 px-4 py-2 rounded-md transition-all duration-300"
                  >
                    <FaSignInAlt />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-4 py-2 rounded-md transition-all duration-300"
                  >
                    <FaUserPlus />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
