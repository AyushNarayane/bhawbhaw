'use client';
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductFilter from "./Filter";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { doc, setDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import toast, { Toaster } from 'react-hot-toast';

const ProductGrid = () => {
  const [productData, setProductData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/getProducts");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const products = await response.json();
        setProductData(products.products);
        setFilteredProducts(products.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setUserId(storedUser.uid); // Set user ID from session storage
    }
  }, []);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
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

  const paginationNumbers = getPaginationNumbers(currentPage, totalPages);

  // Display products for the current page
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Function to filter products based on price range
  const handleFilter = ({ min, max }) => {
    const minPrice = parseFloat(min);
    const maxPrice = parseFloat(max);

    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return;
    }

    const filtered = productData.filter((product) => {
      const price = parseFloat(product.sellingPrice);
      return price >= (minPrice || 0) && price <= (maxPrice || Infinity);
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }

  return (
    <div className="bg-white py-12 px-12">
      <Toaster />
      <div className="flex">
        {/* Filters Section */}
        <ProductFilter onFilter={handleFilter} />

        {/* Product Grid Section */}
        <div className="w-full p-4">
          <div className="flex justify-start gap-5 flex-wrap">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 items-center">
            <div
              className={`cursor-pointer mr-12 ${currentPage === 1 ? "text-[#C4B0A9]" : "text-[#85716B]"}`}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            >
              <FaArrowLeftLong size={24} />
            </div>

            {paginationNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                className={`w-8 h-8 ${currentPage === pageNumber ? "bg-[#85716B] text-white" : "bg-[#C4B0A9] text-white"} rounded-full mx-2`}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            <div
              className={`cursor-pointer ml-12 ${currentPage === totalPages ? "text-[#C4B0A9]" : "text-[#85716B]"}`}
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            >
              <FaArrowRightLong size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
