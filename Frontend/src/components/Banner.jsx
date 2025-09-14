import React from "react";
import banner from "../assets/book19.png";

function Banner() {
  return (
    <div className="w-full ">
      <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 flex flex-col md:flex-row items-center md:items-start justify-between my-20">
        
        {/* Left Side - Text */}
        <div className="w-full md:w-1/2  md:mt-24 text-center md:text-left space-y-6">
  <h1 className="text-3xl md:text-5xl font-bold leading-snug">
    Welcome to <span className="text-pink-500">HariBookStore</span>
  </h1>
  <p className="text-base md:text-lg text-white">
    Discover a wide collection of books that inspire, educate, and entertain.  
    From timeless classics to modern bestsellers, HariBookStore is your trusted
    place to explore stories, knowledge, and imagination. Start your reading
    journey with us today for just ₹1.
  </p>
</div>


        {/* Right Side - Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
          <img
            src={banner}
            alt="hand holding a book"
            className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default Banner;
