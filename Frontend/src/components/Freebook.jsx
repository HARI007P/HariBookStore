import React from "react";
import list from "../../public/list";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Cards from "./Cards";
import { Link } from "react-router-dom";

function Freebook() {
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

  const filterData = list.filter(
    (data) => data.category === "Sold Out"
  );

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
      <Slider {...settings} className="mb-10">
        {filterData.map((item) => (
          <Cards item={item} key={item.id} />
        ))}
      </Slider>

      {/* View All Button */}
      <div className="flex justify-center mt-10">
        <Link
          to="/course"
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
        >
          View All
        </Link>
      </div>
    </div>
  );
}

export default Freebook;
