import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import booksData from "../data/books.json";

function Book() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBooks = () => {
      try {
        setLoading(true);
        // Simulate a small delay to show loading state
        setTimeout(() => {
          setBooks(booksData);
          setError(null);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error loading books:", err);
        setError('Failed to load books. Please try again later.');
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  if (loading) {
    return (
      <div className="max-w-screen-2xl container mx-auto md:px-10 px-4 py-8">
        <div className="mt-28 flex justify-center items-center h-64">
          <div className="text-white text-xl">Loading books...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-2xl container mx-auto md:px-10 px-4 py-8">
        <div className="mt-28 flex justify-center items-center h-64">
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
    <>
      <div className="max-w-screen-2xl container mx-auto md:px-10 px-4 py-8">
        {/* Header Section */}
        <div className="mt-20 text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-white">
            We're delighted to have you{" "}
            <span className="text-pink-500 font-bold">Here! 🎉</span>
          </h1>
          <p className="mt-6 text-white">
            Discover our amazing collection of books from spiritual wisdom to modern knowledge.
          </p>
        </div>


        {/* Books Grid */}
        {books.length > 0 ? (
          <div className="mt-8">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-fr">
              {books.map((item) => (
                <div key={item._id || item.id} className="h-full">
                  <Cards item={item} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-12 text-center text-white py-16">
            <p className="text-xl mb-2">No books available at the moment</p>
            <p className="text-gray-400">Please check back later!</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Book;
