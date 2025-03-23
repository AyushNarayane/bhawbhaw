"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FiMenu, FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearUser, setUser } from "@/redux/userSlice";
import Image from "next/image";
import ProfileDropdown from "./ProfileDropdown";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();
  const router = useRouter();
  const drawerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]); // For search suggestions

  const navLinks = [
    { name: "DOGS AND CATS", href: "/" },
    { name: "AQUARIUM", href: "/" },
    { name: "PRODUCTS", href: "/products" },
    { name: "SERVICES", href: "/service" },
    { name: "BLOG", href: "/blogs" },
    { name: "CONTACT US", href: "/contact" },
    { name: "DEALS", href: "/contact" },
    { name: "KNOW YOUR PET", href: "/" },
  ];

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // Function to fetch products (check localStorage first)
  const fetchProducts = async (searchTerm) => {
    let products = JSON.parse(localStorage.getItem("products"));
    
    // If products are not in localStorage, fetch from API
    if (!products) {
      try {
        const response = await fetch("/api/products/getProducts");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        products = await response.json();
        localStorage.setItem("products", JSON.stringify(products));  // Store fetched products in localStorage
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    }

    // Filter products based on search term
    const activeProducts = products.products.filter(
      (product) =>
        product.status === "active" &&
        (product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );

    return activeProducts;
  };

  const handleSearchChange = async (event) => {
    const input = event.target.value;
    setSearchTerm(input);

    if (input) {
      const filteredProducts = await fetchProducts(input);
      setSuggestions(filteredProducts); // Update suggestions based on the search term
    } else {
      setSuggestions([]); // Clear suggestions if search term is empty
    }
  };

  const handleVoiceSearch = () => {
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  };

  useEffect(() => {
    if (transcript) {
      setSearchTerm(transcript);
      fetchProducts(transcript); // Fetch products on speech recognition
    }
  }, [transcript]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const onLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("user");
    localStorage.removeItem("persist:root");
    setIsOpen(false);
    router.push("/signin");
  };

  const handleSearch = async () => {
    const activeProducts = await fetchProducts(searchTerm || transcript);
  
    if (activeProducts.length > 0) {
      // Redirect to /search with the query parameter directly in the URL
      router.push(`/search?query=${encodeURIComponent(searchTerm || transcript)}`);
    } else {
      alert("No products found matching your search.");
    }
  };
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <nav className="bg-[#39646e] text-white py-5 lg:px-12 sm:px-6 px-2 relative whitespace-nowrap">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/images/bhawbhawfavicon.png"
              alt="BHAW Logo"
              width={100}
              height={100}
              className="max-sm:h-14 h-16 w-auto mx-2 cursor-pointer"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="hidden lg:flex flex-grow justify-center lg:space-x-8 text-gray-600">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="hover:text-black text-white cursor-pointer"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Icons and Buttons */}
        <div className="flex items-center space-x-4 ml-auto">
          {user ? (
            <>
              <Link href="/recommendation" onClick={() => setIsOpen(false)}>
                <button>
                  <img
                    src="/images/navbar/heart.png"
                    alt="Wishlist"
                    className="w-6 h-6"
                  />
                </button>
              </Link>
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                <button>
                  <img
                    src="/images/navbar/cart.png"
                    alt="Cart"
                    className="w-6 h-6"
                  />
                </button>
              </Link>
              <ProfileDropdown onLogout={onLogout} />
            </>
          ) : (
            <>
              <Link href="/signin" onClick={() => setIsOpen(false)}>
                <button className="text-black px-4 py-2 bg-white rounded-full">
                  LOGIN
                </button>
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)}>
                <button className="flex items-center justify-between w-full bg-[#ef4444] font-semibold hover:bg-[#ffb315] text-white sm:px-8 px-4 py-2 rounded-full">
                  <p>
                    Sign Up <span className="sm:inline-block hidden">Now</span>
                  </p>
                  <img
                    src="/images/navbar/image.png"
                    alt="Icon"
                    className="w-5 h-5 ml-2"
                  />
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Icon */}
        <div className="lg:hidden flex items-center">
          <button onClick={toggleDrawer} className="focus:outline-none">
            <FiMenu className="w-6 h-6 ml-4 text-gray-600 hover:text-black" />
          </button>
        </div>
      </div>

      {/* Top Section: Search Bar */}
      <div className="flex flex-col items-center mb-3">
        <div className="flex items-center border-2 border-gray-300 rounded-full px-4 py-1 max-w-2xl w-full relative">
          <input
            type="text"
            value={searchTerm || transcript}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="bg-transparent outline-none ml-2 w-full"
          />
          <button onClick={handleSearch} className="ml-2 p-1 rounded-full">
            <FiSearch className="text-white size-5" />
          </button>
          <button
            onClick={handleVoiceSearch}
            className="ml-2 p-1 bg-gray-200 rounded-full"
          >
            <Image
              src="/images/navbar/voice-icon.png"
              alt="Voice Search"
              width={24}
              height={24}
              className="h-7 w-8 rounded-full"
            />
          </button>
          
          {/* Display Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full rounded-lg left-0 right-0 bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto z-[100]">
              {suggestions.map((product) => (
                <Link
                  key={product.productId}
                  href={`/productdetails/${product.productId}`}
                  className="block px-4 py-2 text-black hover:bg-gray-100"
                >
                  {product.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div
          ref={drawerRef}
          className="fixed top-0 left-0 w-full h-screen bg-white shadow-lg z-[100] transition-transform duration-300 transform lg:hidden"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="bg-red-500 text-white rounded-full size-8 m-4 flex items-center justify-center"
          >
            X
          </button>

          <ul className="flex flex-col items-center text-gray-600 p-6 space-y-4">
            {[ 
              { name: "PRODUCTS", path: "/products" }, 
              { name: "SERVICES", path: "/service" },
              { name: "BLOG", path: "/blogs" },
              { name: "CONTACT US", path: "/contact" }
            ].map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-black text-[#C4B0A9] cursor-pointer py-2 text-lg font-medium"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="py-4">
              {user ? (
                <ProfileDropdown onLogout={onLogout} />
              ) : (
                <>
                  <Link href="/signin" onClick={() => setIsOpen(false)}>
                    <button className="text-white px-3 py-1 rounded-md">
                      LOGIN
                    </button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <button className="bg-[#ef4444] font-semibold hover:bg-[#ffb315] text-white sm:px-8 px-4 py-2 rounded-full">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
