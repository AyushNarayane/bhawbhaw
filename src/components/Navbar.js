"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FiMenu, FiSearch, FiChevronDown } from "react-icons/fi";
import { FaInstagram, FaYoutube, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearUser, setUser } from "@/redux/userSlice";
import Image from "next/image";
import ProfileDropdown from "./ProfileDropdown";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.userId);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const drawerRef = useRef(null);
  const searchContainerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]); // For search suggestions
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showSocials, setShowSocials] = useState(false);
  const socialsRef = useRef(null);
  const dropdownRef = useRef(null);

  const navLinks = [
    { name: "PRODUCTS", href: "/products" },
    { name: "SERVICES", href: "/service" },
    { name: "BLOG", href: "/blogs" },
    { name: "DEALS", href: "/contact" },
    { name: "KNOW YOUR PET", href: "/" },
    { name: "SOCIALS", href: "#", dropdown: true },
    { name: "CONTACT US", href: "/contact" },
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

    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    
    // Filter active products and add relevance score
    const scoredProducts = products.products
      .filter(product => product.status === "active")
      .map(product => {
        const title = product.title.toLowerCase();
        const description = product.description.toLowerCase();
        
        // Calculate relevance score
        let score = 0;
        
        // Exact match in title (highest priority)
        if (title === normalizedSearchTerm) {
          score += 100;
        }
        // Title starts with search term
        else if (title.startsWith(normalizedSearchTerm)) {
          score += 80;
        }
        // Title contains search term
        else if (title.includes(normalizedSearchTerm)) {
          score += 60;
        }
        // Description contains search term
        else if (description.includes(normalizedSearchTerm)) {
          score += 20;
        }
        // No exact match, check for word parts in title (partial match)
        else {
          const words = title.split(' ');
          for (const word of words) {
            if (word.includes(normalizedSearchTerm) || normalizedSearchTerm.includes(word)) {
              score += 30;
              break;
            }
          }
        }
        
        // If no match found through normal means, try checking for common typos
        // or close matches (simple approximation)
        if (score === 0) {
          const titleWords = title.split(' ');
          for (const word of titleWords) {
            // Check if word is similar (at least 70% similar)
            if (word.length > 3 && normalizedSearchTerm.length > 3) {
              // Simple character overlap check
              const overlap = [...word].filter(char => normalizedSearchTerm.includes(char)).length;
              const similarity = overlap / Math.max(word.length, normalizedSearchTerm.length);
              
              if (similarity > 0.7) {
                score += 10;
                break;
              }
            }
          }
        }
        
        // Only return products with a score > 0
        return {
          ...product,
          score
        };
      })
      .filter(product => product.score > 0)
      .sort((a, b) => b.score - a.score) // Sort by score in descending order
      .slice(0, 8); // Limit to top 8 results
      
    return scoredProducts;
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

  useEffect(() => {
    if (!user) {
      setCartItemCount(0);
      return;
    }
    
    // Set up a real-time listener for cart changes
    const cartRef = doc(db, 'cart', user);
    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      if (snapshot.exists()) {
        const items = snapshot.data().items || [];
        setCartItemCount(items.length);
      } else {
        setCartItemCount(0);
      }
    }, (error) => {
      console.error("Error listening to cart updates:", error);
    });
    
    // Clean up listener on unmount
    return () => unsubscribe();
  }, [user]);

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

  const onLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      localStorage.removeItem("user");
      localStorage.removeItem("persist:root");
      localStorage.removeItem("currentUserId");
      setIsOpen(false);

      if (typeof window !== 'undefined') {
        window.location.href = "/signin";
      }
    } catch (error) {
      console.error("Error signing out: ", error);
    }
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    if (suggestions.length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [suggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        socialsRef.current && 
        dropdownRef.current &&
        !socialsRef.current.contains(event.target) && 
        !dropdownRef.current.contains(event.target)
      ) {
        setShowSocials(false);
      }
    };

    if (showSocials) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSocials]);

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-[#39646e] shadow-lg text-white pt-6 pb-8 px-4 lg:px-16 relative">
        <div className="flex items-start lg:items-center justify-between w-full">
          {/* Logo - Large and vertically aligned */}
          <div className="flex-shrink-0 flex flex-col justify-center" style={{ height: '80px' }}>
            <Link href="/">
              <Image
                src="/images/bhawbhawfavicon.png"
                alt="BHAW Logo"
                width={120}
                height={80}
                className="h-20 w-auto mx-2"
                priority
              />
            </Link>
          </div>

          {/* Navigation Links - aligned to middle of logo */}
          <ul className="hidden lg:flex flex-grow items-center ml-8 space-x-10 text-lg font-bold tracking-wide h-20">
            {navLinks.map((link, index) => (
              <li key={index} className="relative flex items-center h-full">
                {link.dropdown ? (
                  <div className="relative">
                    <button
                      ref={socialsRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSocials(!showSocials);
                      }}
                      className="hover:text-[#ffb315] text-white cursor-pointer flex items-center transition-colors duration-200"
                    >
                      {link.name}
                      <FiChevronDown 
                        className={`ml-1 transform transition-transform duration-200 ${
                          showSocials ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    {showSocials && (
                      <div 
                        ref={dropdownRef}
                        className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white rounded-md shadow-lg z-50 mt-2 min-w-[160px]"
                      >
                        <ul className="py-1">
                          <li>
                            <Link 
                              href="https://www.instagram.com/bhaw_bhaww/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                              onClick={() => setShowSocials(false)}
                            >
                              <FaInstagram className="text-pink-600 mr-2" size={16} />
                              Instagram
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="https://youtube.com/@bhawbhaw-com?si=c4ryrGze594Jf5xA" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                              onClick={() => setShowSocials(false)}
                            >
                              <FaYoutube className="text-pink-600 mr-2" size={16} />
                              Youtube
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="https://www.facebook.com/profile.php?id=61568752592399" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                              onClick={() => setShowSocials(false)}
                            >
                              <FaFacebook className="text-blue-600 mr-2" size={16} />
                              Facebook
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="https://chat.whatsapp.com/LqGNKlnZjS149Fgz1eiRTA" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                              onClick={() => setShowSocials(false)}
                            >
                              <FaWhatsapp className="text-green-600 mr-2" size={16} />
                              WhatsApp
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="hover:text-[#ffb315] text-white cursor-pointer transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Icons and Buttons - right aligned, vertically centered */}
          <div className="flex items-center space-x-4 ml-auto h-20">
            {user ? (
              <>
                <Link href="/recommendation" onClick={() => setIsOpen(false)}>
                  <button>
                    <img
                      src="/images/navbar/heart.png"
                      alt="Wishlist"
                      className="w-7 h-7 hover:scale-110 transition-transform duration-200"
                    />
                  </button>
                </Link>
                <Link href="/cart" onClick={() => setIsOpen(false)}>
                  <button className="relative">
                    <img
                      src="/images/navbar/cart.png"
                      alt="Cart"
                      className="w-7 h-7 hover:scale-110 transition-transform duration-200"
                    />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </Link>
                <ProfileDropdown onLogout={onLogout} />
              </>
            ) : (
              <>
                <Link href="/signin" onClick={() => setIsOpen(false)}>
                  <button className="font-semibold px-5 py-2 bg-white text-[#39646e] rounded-full shadow hover:bg-[#ffb315] hover:text-white transition-colors duration-200">
                    LOGIN
                  </button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <button className="flex items-center justify-between w-full bg-[#ef4444] font-semibold hover:bg-[#ffb315] text-white sm:px-8 px-4 py-2 rounded-full shadow transition-colors duration-200">
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
              <FiMenu className="w-7 h-7 ml-4 text-gray-200 hover:text-[#ffb315] transition-colors duration-200" />
            </button>
          </div>
        </div>

        {/* SEARCH BAR - inside navbar, centered, shorter */}
        <div className="flex flex-col items-center mt-1">
          <div ref={searchContainerRef} className="flex items-center bg-[#eaeaea] shadow-lg border border-gray-200 rounded-full px-4 py-3 max-w-md w-full relative">
            <input
              type="text"
              value={searchTerm || transcript}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="bg-transparent outline-none text-gray-700 placeholder-gray-500 font-medium text-lg px-2 w-full"
            />
            <button onClick={handleSearch} className="ml-2 p-2 rounded-full bg-[#ffb315] hover:bg-[#ef4444] transition-colors duration-200 shadow">
              <FiSearch className="text-white size-5" />
            </button>
            <button
              onClick={handleVoiceSearch}
              className="ml-2 p-2 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 rounded-full shadow"
            >
              <Image
                src="/images/navbar/voice-icon.png"
                alt="Voice Search"
                width={24}
                height={24}
                className="h-6 w-6 rounded-full"
              />
            </button>
            {/* Display Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto z-[100]">
                {suggestions.map((product) => (
                  <Link
                    key={product.productId}
                    href={`/productdetails/${product.productId}`}
                    className="block px-4 py-2 text-black hover:bg-gray-100 rounded-md transition-colors duration-150"
                    onClick={() => setSuggestions([])}
                  >
                    {product.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

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
              { name: "CONTACT US", path: "/contact" },
              { name: "SOCIALS", path: "#", dropdown: true }
            ].map((item) => (
              <li key={item.path}>
                {item.dropdown ? (
                  <div className="py-2">
                    <button
                      ref={socialsRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSocials(!showSocials);
                      }}
                      className="flex items-center justify-center hover:text-black text-[#C4B0A9] cursor-pointer text-lg font-medium mb-2 w-full"
                    >
                      {item.name}
                      <FiChevronDown 
                        className={`ml-1 transform transition-transform duration-200 ${
                          showSocials ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    {showSocials && (
                      <div 
                        ref={dropdownRef}
                        className="flex flex-col"
                      >
                        <Link 
                          href="https://www.instagram.com/bhaw_bhaww/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                          onClick={() => setShowSocials(false)}
                        >
                          <FaInstagram className="text-pink-600 mr-2" size={16} />
                          Instagram
                        </Link>
                        <Link 
                          href="https://youtube.com/@bhawbhaw-com?si=c4ryrGze594Jf5xA" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                          onClick={() => setShowSocials(false)}
                        >
                          <FaYoutube className="text-pink-600 mr-2" size={16} />
                          Youtube
                        </Link>
                        <Link 
                          href="https://www.facebook.com/profile.php?id=61568752592399" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                          onClick={() => setShowSocials(false)}
                        >
                          <FaFacebook className="text-blue-600 mr-2" size={16} />
                          Facebook
                        </Link>
                        <Link 
                          href="https://chat.whatsapp.com/LqGNKlnZjS149Fgz1eiRTA" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                          onClick={() => setShowSocials(false)}
                        >
                          <FaWhatsapp className="text-green-600 mr-2" size={16} />
                          WhatsApp
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className="hover:text-black text-[#C4B0A9] cursor-pointer py-2 text-lg font-medium"
                  >
                    {item.name}
                  </Link>
                )}
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
    </>
  );
};

export default Navbar;
