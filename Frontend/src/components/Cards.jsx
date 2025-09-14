import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Cards({ item }) {
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(false);

  const handleBuyNow = () => {
    navigate("/payment", {
      state: {
        bookname: item.name,
        bookcode: item.bookcode,
      },
    });
  };

  const handleDescription = () => {
    setShowDescription(true);
  };

  const closeModal = () => {
    setShowDescription(false);
  };

  return (
    <div className="p-3">
      {/* Enhanced Card Container */}
      <div className="relative  rounded-xl  hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden border border-gray-200 h-full flex flex-col">
        
        {/* Book Image with Overlay */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={item.image}
            alt="Book Cover"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          
          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          {/* Status Badge */}
          {item.category === "Sale" && (
            <div className="absolute top-3 left-3">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                ✨ Available
              </span>
            </div>
          )}

          {item.category === "Sold Out" && (
            <div className="absolute top-3 left-3">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                🚫 Sold Out
              </span>
            </div>
          )}
          
        </div>

        {/* Card Content */}
        <div className="p-4 flex flex-col flex-grow bg-gray-400">
          {/* Book Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight min-h-[1rem]">
            {item.name}
          </h3>

          {/* Author/Donor */}
          <div className="flex items-center mb-1">
            <span className="text-black mr-2">Donated By: </span>
            <p className="text-sm text-gray-600 truncate font-medium">
              {item.donar}
            </p>
          </div>

          {/* Book Description */}
          <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed flex-grow">
            {item.title || ""}
          </p>


          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleDescription}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 border border-gray-300"
            >
              📜 Details
            </button>
            
            {item.category === "Sale" && (
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                🛒 Buy Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {showDescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl relative overflow-hidden">
            {/* Modal Header with Image */}
            <div className="relative h-48 bg-gradient-to-r from-pink-500 to-purple-600">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              {/* Book Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                {item.name}
              </h2>
              
              {/* Author */}
              <div className="flex items-center mb-4">
                <span className="text-pink-500 mr-2">Donated By:</span>
                <p className="text-gray-600 font-medium">{item.donar}</p>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">📚 About this book</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {item.description || item.title || "This is an amazing book that offers great insights and knowledge. Perfect for readers who are looking to expand their understanding and explore new perspectives. A must-read addition to any book lover's collection."}
                  </p>
                </div>
              </div>
              
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200 border border-gray-300"
                >
                  ← Back
                </button>
                {item.category === "Sale" && (
                  <button
                    onClick={() => {
                      closeModal();
                      handleBuyNow();
                    }}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    🛒 Buy Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cards;
