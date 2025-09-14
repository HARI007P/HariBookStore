import React, { useEffect } from "react";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Free from "../components/Freebook";
import Footer from "../components/Footer";

function Home() {
  useEffect(() => {
    // Reload once after signup
    if (localStorage.getItem("justSignedUp")) {
      localStorage.removeItem("justSignedUp");
      window.location.reload();
    }
  }, []);

  return (
    <div className=" text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="w-full shadow-md sticky top-0 z-50 bg-gray-900">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-12">
        {/* Banner Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-6 md:mt-10"
        >
          <Banner />
        </motion.section>

        {/* Featured Books Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 md:mt-16"
        >
          
          <Free />
        </motion.section>
        
        {/* Why Choose Us Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 md:mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-pink-500">HariBookStore</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="gray-300 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center"
            >
              <div className="bg-pink-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Collection</h3>
              <p className="text-gray-300 leading-relaxed">
                Carefully curated books from spiritual wisdom to modern knowledge, 
                ensuring every read enriches your mind.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className=" backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center"
            >
              <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Affordable Prices</h3>
              <p className="text-gray-300 leading-relaxed">
                Books starting at just ₹1 with ₹34 delivery. 
                Knowledge shouldn't be expensive!
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className=" backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center"
            >
              <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-gray-300 leading-relaxed">
                Quick delivery within 3 working days to Andhra Pradesh, 
                Telangana, and Odisha.
              </p>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className=" mt-8">
        <Footer />
      </footer>
    </div>
  );
}

export default Home;
