import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import aboutImage from "../assets/book4.png";

function About() {

  return (
    <>
      <Navbar />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 mt-10 text-white text-center ">
          About <span className="text-pink-500">Us</span>
        </h1>

        {/* Responsive Flex Layout */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Image - hidden on mobile */}
          <div className="hidden md:flex justify-center md:justify-start flex-shrink-0">
            <img
              src={aboutImage}
              alt="Bookshelf"
              className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] h-auto  transition-transform transform hover:scale-105 duration-300"
            />
          </div>

          {/* Text */}
          <div className="space-y-5 text-base sm:text-lg md:text-xl text-white leading-relaxed">
           <p>
  Welcome to{" "}
  <span className="text-pink-400 font-semibold">Hari's BookStore</span> — 
  your trusted destination for books that inspire, entertain, and educate.  
</p>
<p>
  We’re more than just a bookstore. Our space is a vibrant hub for readers 
  to explore new titles, rediscover timeless classics, and share the joy of 
  reading with a community of fellow book lovers.  
</p>
<p>
  From the latest bestsellers to hidden gems across every genre, our shelves 
  are carefully curated to match every reader’s taste and curiosity.  
</p>
<p>
  At <span className="text-pink-400 font-semibold">Hari's BookStore</span>, 
  we put readers first. Our friendly team is always ready to guide you, 
  whether you’re searching for your next favorite read or a thoughtful gift.  
</p>
<p>
  Thank you for choosing us as part of your reading journey. 
  Together, let’s celebrate the power of stories to connect, inspire, and 
  transform lives.  
</p>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default About;
