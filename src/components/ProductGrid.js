"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductFilter from "./Filter";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ProductGrid = () => {
  const [productData, setProductData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserId(storedUser.userId); // Set user ID from local storage
    } else {
      router.push("/signin"); // Redirect to sign-in if user is not logged in
      return;
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/getProducts");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const products = await response.json();
        const activeProducts = products.products.filter(
          (product) => product.status !== "disabled"
        );

        // setProductData(products.products);
        // setFilteredProducts(products.products);
        setProductData(activeProducts);
        setFilteredProducts(activeProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
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

  const handleFilter = ({ subcategories, brands, min, max }) => {
    const minPrice = parseFloat(min);
    const maxPrice = parseFloat(max);

    const filtered = productData.filter((product) => {
      const price = parseFloat(product.sellingPrice);
      const matchesSubcategories =
        subcategories.length === 0 ||
        subcategories.includes(product.subCategory);
      const matchesBrands =
        brands.length === 0 || brands.includes(product.brand || "Unknown");
      const matchesPrice =
        (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);

      return matchesSubcategories && matchesBrands && matchesPrice;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  // TODO: SHOW ONLY ACTIVE PRODUCTS
  return (
    <div className="bg-white py-12 px-12 font-poppins">
      <Toaster />
      <div className="flex">
        {/* Filters Section */}
        <ProductFilter onFilter={handleFilter} products={productData} />

        {/* Product Grid Section */}
        <div className="w-full p-4">
          <div className="flex justify-start gap-5 flex-wrap">
            {displayedProducts.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 items-center">
            <div
              className={`cursor-pointer mr-12 ${
                currentPage === 1 ? "text-[#C4B0A9]" : "text-[#85716B]"
              }`}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            >
              <FaArrowLeftLong size={24} />
            </div>

            {paginationNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                className={`w-8 h-8 ${
                  currentPage === pageNumber
                    ? "bg-[#85716B] text-white"
                    : "bg-[#C4B0A9] text-white"
                } rounded-full mx-2`}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            <div
              className={`cursor-pointer ml-12 ${
                currentPage === totalPages ? "text-[#C4B0A9]" : "text-[#85716B]"
              }`}
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
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
