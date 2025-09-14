import React, { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Cards from "./Cards";
import { Link } from "react-router-dom";
import booksData from "../data/books.json";

function Freebook() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Load books from local JSON
  useEffect(() => {
    const loadBooks = () => {
      try {
        setLoading(true);
        // Simulate a small delay to show loading state
        setTimeout(() => {
          setBooks(booksData);
          setError(null);
          setLoading(false);
        }, 300);
      } catch (err) {
        console.error('Error loading books:', err);
        setError('Failed to load books. Please try again later.');
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1280, // Large screens (lg, xl)
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 1024, // Medium screens
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // Tablets
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // Mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Filter books for "Sold Out" category (₹1 books)
  const filterData = books.filter(
    (data) => data.category === "Sold Out"
  );

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-20 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-xl">Loading books...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-20 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500 text-xl text-center">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-20 py-16">
      {/* Title Section */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-600 mb-3">
          Rs 1 Books
        </h1>
       <p className="text-sm sm:text-base md:text-lg text-white leading-relaxed max-w-2xl mx-auto md:mx-0">
  Discover inspiring stories, timeless knowledge, and life-changing lessons —
  all starting at just ₹1. At HariBookStore, every book is a gateway to learning,
  growth, and imagination.
</p>

      </div>

      {/* Slider */}
      {filterData.length > 0 ? (
        <Slider {...settings} className="mb-10">
          {filterData.map((item) => (
            <Cards item={item} key={item._id || item.id} />
          ))}
        </Slider>
      ) : (
        <div className="text-center text-white py-16">
          <p className="text-lg mb-4">No ₹1 books available at the moment.</p>
          <p className="text-sm text-gray-300">Please check back later!</p>
        </div>
      )}

      {/* View All Button */}
      <div className="flex justify-center mt-10">
        <Link
          to="/books"
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
        >
          View All
        </Link>
      </div>
    </div>
  );
}

export default Freebook;
