"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductFilter from "./Filter";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { db } from "firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const ProductGrid = () => {
  const [productData, setProductData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [vendors, setVendors] = useState({});
  const productsPerPage = 8;
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserId(storedUser.userId); // Set user ID from local storage
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
        const activeProducts = products.products
          .filter((product) => product.status === "active")
          .sort((a, b) => a.sellingPrice - b.sellingPrice);
        // console.log(activeProducts);

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

  // Fetch vendor data for a specific vendorId
  const fetchVendorData = async (vendorId) => {
    // Check if we've already fetched this vendor's data
    if (vendors[vendorId]) {
      return vendors[vendorId];
    }

    try {
      const vendorRef = doc(db, "vendors", vendorId);
      const vendorSnapshot = await getDoc(vendorRef);
      
      if (vendorSnapshot.exists()) {
        const vendorData = vendorSnapshot.data();
        // Store in state for future reference
        setVendors(prev => ({
          ...prev,
          [vendorId]: vendorData
        }));
        return vendorData;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching vendor ${vendorId}:`, error);
      return null;
    }
  };

  // Filter products by nearby vendors
  const filterByNearbyVendors = async (products, userCity) => {
    setLoadingNearby(true);
    try {
      const nearbyProducts = [];

      for (const product of products) {
        // Skip products without vendorId
        if (!product.vendorId) continue;

        // Get vendor data
        const vendorData = await fetchVendorData(product.vendorId);
        
        if (vendorData && vendorData.businessDetails && vendorData.businessDetails.city) {
          const vendorCity = vendorData.businessDetails.city.toLowerCase();
          // Check if the vendor city matches the user's city
          if (vendorCity.includes(userCity.toLowerCase()) || userCity.toLowerCase().includes(vendorCity) ) {
            nearbyProducts.push(product);
          }
        }
      }
      
      return nearbyProducts;
    } catch (error) {
      console.error("Error filtering by nearby vendors:", error);
      toast.error("Error finding nearby products");
      return products; // Return all products on error
    } finally {
      setLoadingNearby(false);
    }
  };

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

  const handleFilter = async ({ subcategories, brands, min, max, sortDirection, isNearby, userCity }) => {
    const minPrice = parseFloat(min);
    const maxPrice = parseFloat(max);

    // Basic filtering by subcategories, brands and price
    let filtered = productData.filter((product) => {
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

    // Filter by nearby vendors if active
    if (isNearby && userCity) {
      filtered = await filterByNearbyVendors(filtered, userCity);
    }

    // Apply sorting if specified
    let sortedProducts = [...filtered];
    if (sortDirection === 'asc') {
      sortedProducts.sort((a, b) => parseFloat(a.sellingPrice) - parseFloat(b.sellingPrice));
    } else if (sortDirection === 'desc') {
      sortedProducts.sort((a, b) => parseFloat(b.sellingPrice) - parseFloat(a.sellingPrice));
    }

    setFilteredProducts(sortedProducts);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white py-12 px-12 font-poppins">
      <Toaster />
      <div className="flex">
        {/* Filters Section */}
        <ProductFilter onFilter={handleFilter} products={productData} />

        {/* Product Grid Section */}
        <div className="w-full p-4">
          {loadingNearby ? (
            <div className="text-center py-8">
              <p>Finding nearby products...</p>
            </div>
          ) : (
            <div className="flex justify-start gap-5 flex-wrap">
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))
              ) : (
                <div className="w-full text-center py-8">
                  <p>No products found matching your criteria.</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
