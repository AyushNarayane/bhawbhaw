"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../../../components/ProductCard";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import Protected from "@/components/ProtectedRoute";

const productsPerPage = 3;

const Recommendation = () => {
  const dispatch = useDispatch();
  const wishlistProducts = useSelector((state) => state.wishlist.items);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentForYouPage, setCurrentForYouPage] = useState(1);

  // Pagination logic for wishlist products
  const totalWishlistPages = Math.ceil(wishlistProducts.length / productsPerPage);
  const indexOfLastWishlistProduct = currentPage * productsPerPage;
  const indexOfFirstWishlistProduct = indexOfLastWishlistProduct - productsPerPage;
  const currentWishlistProducts = wishlistProducts.slice(indexOfFirstWishlistProduct, indexOfLastWishlistProduct);

  // Create a unique set of categories from the wishlist products
  const categories = [...new Set(wishlistProducts.map(product => product.category))];

  // Filter products based on the user's wishlist categories for recommendations
  const forYouProducts = wishlistProducts.filter(product => categories.includes(product.category));
  const totalForYouPages = Math.ceil(forYouProducts.length / productsPerPage);
  const indexOfLastForYouProduct = currentForYouPage * productsPerPage;
  const indexOfFirstForYouProduct = indexOfLastForYouProduct - productsPerPage;
  const currentForYouProducts = forYouProducts.slice(indexOfFirstForYouProduct, indexOfLastForYouProduct);

  // Function to get pagination numbers
  const getPaginationNumbers = (currentPage, totalPages) => {
    const paginationNumbers = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (totalPages <= 3) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage === 1) {
        endPage = 3;
      } else if (currentPage === totalPages) {
        startPage = totalPages - 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationNumbers.push(i);
    }

    return paginationNumbers;
  };

  const wishlistPaginationNumbers = getPaginationNumbers(currentPage, totalWishlistPages);
  const forYouPaginationNumbers = getPaginationNumbers(currentForYouPage, totalForYouPages);

  return (
    <div className="lg:px-12 bg-white text-black p-6 font-poppins">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-4">Wishlist ({wishlistProducts.length})</h2>
        {currentWishlistProducts.length === 0 ? (
          <p>No products in your wishlist.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentWishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} isRecommendation={true} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-4 font-kiwi items-center">
          <div
            className={`cursor-pointer mr-12 ${currentPage === 1 ? "text-[#C4B0A9]" : "text-[#85716B]"}`}
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            aria-label="Previous page"
          >
            <FaArrowLeftLong size={24} />
          </div>

          {wishlistPaginationNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              className={`w-8 h-8 ${currentPage === pageNumber ? "bg-[#85716B] text-white" : "bg-[#C4B0A9] text-white"} rounded-full mx-2`}
              onClick={() => setCurrentPage(pageNumber)}
              aria-label={`Page ${pageNumber}`}
            >
              {pageNumber}
            </button>
          ))}

          <div
            className={`cursor-pointer ml-12 ${currentPage === totalWishlistPages ? "text-[#C4B0A9]" : "text-[#85716B]"}`}
            onClick={() => currentPage < totalWishlistPages && setCurrentPage(currentPage + 1)}
            aria-label="Next page"
          >
            <FaArrowRightLong size={24} />
          </div>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <div className="h-10 w-5 mr-5 bg-[#E57373] rounded-3xl"></div>
        <h2 className="text-xl font-medium">For You ({forYouProducts.length})</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentForYouProducts.length === 0 ? (
          <p>No recommendations available.</p>
        ) : (
          currentForYouProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      <div className="flex justify-center mt-4 font-kiwi items-center">
        <div
          className={`cursor-pointer mr-12 ${currentForYouPage === 1 ? "text-[#C4B0A9]" : "text-[#85716B]"}`}
          onClick={() => currentForYouPage > 1 && setCurrentForYouPage(currentForYouPage - 1)}
          aria-label="Previous page for recommendations"
        >
          <FaArrowLeftLong size={24} />
        </div>

        {forYouPaginationNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className={`w-8 h-8 ${currentForYouPage === pageNumber ? "bg-[#85716B] text-white" : "bg-[#C4B0A9] text-white"} rounded-full mx-2`}
            onClick={() => setCurrentForYouPage(pageNumber)}
            aria-label={`Page ${pageNumber} for recommendations`}
          >
            {pageNumber}
          </button>
        ))}

        <div
          className={`cursor-pointer ml-12 ${currentForYouPage === totalForYouPages ? "text-[#C4B0A9]" : "text-[#85716B]"}`}
          onClick={() => currentForYouPage < totalForYouPages && setCurrentForYouPage(currentForYouPage + 1)}
          aria-label="Next page for recommendations"
        >
          <FaArrowRightLong size={24} />
        </div>
      </div>
    </div>
  );
};

export default Protected(Recommendation);
