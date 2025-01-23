"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "../../../components/ProductCard";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import Protected from "@/components/ProtectedRoute";
import { db } from "firebaseConfig";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";

const productsPerPage = 4;

const Recommendation = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [forYouProducts, setForYouProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentForYouPage, setCurrentForYouPage] = useState(1);

  const userId = localStorage.getItem("userId"); // Retrieve userId from local storage

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser.userId;

    if (!userId) {
      toast.error("User not logged in!");
      return;
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true);

        // Get wishlist from Firestore
        const wishlistRef = doc(db, "wishlists", userId); // Collection: 'wishlists', Document: userId
        const wishlistDoc = await getDoc(wishlistRef);

        if (wishlistDoc.exists()) {
          const wishlistData = wishlistDoc.data();
          const wishlistProducts = wishlistData.items || [];
          setWishlistProducts(wishlistProducts);

          // Extract unique categories from wishlist
          const categories = [...new Set(wishlistProducts.map((product) => product.category))];

          // Get recommendations based on categories
          const productsRef = collection(db, "products"); // Assuming 'products' collection exists
          const recommendationsQuery = query(productsRef, where("category", "in", categories));
          const recommendationsSnapshot = await getDocs(recommendationsQuery);

          const recommendations = recommendationsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setForYouProducts(recommendations);
        } else {
          console.warn("No wishlist found for this user.");
          setWishlistProducts([]);
          setForYouProducts([]);
        }
      } catch (error) {
        console.error("Error fetching wishlist and recommendations:", error);
        toast.error("Failed to fetch wishlist and recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId]);

  // Pagination logic for wishlist products
  const totalWishlistPages = Math.ceil(wishlistProducts.length / productsPerPage);
  const indexOfLastWishlistProduct = currentPage * productsPerPage;
  const indexOfFirstWishlistProduct = indexOfLastWishlistProduct - productsPerPage;
  const currentWishlistProducts = wishlistProducts.slice(indexOfFirstWishlistProduct, indexOfLastWishlistProduct);

  // Pagination logic for recommendations
  const totalForYouPages = Math.ceil(forYouProducts.length / productsPerPage);
  const indexOfLastForYouProduct = currentForYouPage * productsPerPage;
  const indexOfFirstForYouProduct = indexOfLastForYouProduct - productsPerPage;
  const currentForYouProducts = forYouProducts.slice(indexOfFirstForYouProduct, indexOfLastForYouProduct);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="lg:px-12 bg-white text-black p-6 font-poppins">
      <Toaster />
      <div className="mb-6">
        <div className="flex items-center mb-6">
          <div className="h-10 w-2 mr-5 bg-[#E57373] rounded-3xl"></div>
          <h2 className="text-xl font-medium">Wishlist ({wishlistProducts.length})</h2>
        </div>
        {currentWishlistProducts.length === 0 ? (
          <p>No products in your wishlist.</p>
        ) : (
          <div className="flex flex-wrap gap-10 justify-evenly">
            {currentWishlistProducts.map((product) => (
              <ProductCard key={product.productId} product={product} isRecommendation={true} />
            ))}
          </div>
        )}

        {/* Wishlist Pagination */}
        <div className="flex justify-center mt-4 items-center">
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

      <div className="h-px w-full bg-gray-300 my-6" />

      <div className="flex items-center mb-6">
        <div className="h-10 w-2 mr-5 bg-[#E57373] rounded-3xl"></div>
        <h2 className="text-xl font-medium">For You ({forYouProducts.length})</h2>
      </div>

      {/* Recommendations */}
      <div className="flex flex-wrap gap-10 justify-evenly">
        {currentForYouProducts.length === 0 ? (
          <p>No recommendations available.</p>
        ) : (
          currentForYouProducts.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))
        )}
      </div>

      {/* Recommendations Pagination */}
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
