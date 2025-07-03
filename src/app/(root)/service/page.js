"use client";

import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ServiceCard from "@/components/ServiceCard";
import { useDispatch } from "react-redux";
import { setSelectedService } from "@/redux/serviceSlice";
import ProtectedHomeRoute from "@/components/ProtectedHomeRoute";

const Page = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [city, setCity] = useState("");
  const [showCityModal, setShowCityModal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const additionalCategories = [
    "Pet Grooming Services",
    "Pet Boarding and Daycare",
    "Pet Training Services",
    "Pet Walking and Exercise",
    "Veterinary and Health Services",
    "Pet Transportation Services",
    "Pet Nutrition Services",
    "Specialized Care",
    "Pet Adoption and Rescue Services",
    "Pet Photography and Art",
    "Pet Accessories and Supplies",
  ];

  const loadingMessages = [
    "🐾 Finding pet services in your area...",
    "🔍 Searching for the best providers...",
    "📋 Checking service availability...",
    "🌟 Discovering amazing pet care options...",
    "💫 Almost there, just a moment...",
    "🎯 Matching you with perfect services...",
    "✨ Loading your personalized results...",
    "🏠 Connecting with local pet experts..."
  ];

  // Extract unique categories
  const extractCategories = (services) => {
    const uniqueCategories = [
      "All",
      ...new Set(services.map((service) => service.serviceType)),
      ...additionalCategories,
    ];
    setCategories(uniqueCategories);
  };

  // Fetch services once city is submitted
  useEffect(() => {
    if (showCityModal || !city) return;

    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await fetch(
          `/api/services/getAllServices?city=${encodeURIComponent(city)}`
        );
        if (response.ok) {
          const data = await response.json();
          setServices(data);
          setFilteredServices(data);
          extractCategories(data);
        } else {
          console.error("Error fetching services");
          setError("Failed to fetch services. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("An error occurred while fetching services. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [city, showCityModal]);

  // Filter services by search and category
  useEffect(() => {
    const filter = () => {
      let result = services;

      if (searchQuery) {
        result = result.filter((service) =>
          service.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedCategory !== "All") {
        result = result.filter(
          (service) => service.serviceType === selectedCategory
        );
      }

      setFilteredServices(result);
    };

    filter();
  }, [searchQuery, selectedCategory, services]);

  // Rotate loading messages every 2 seconds
  useEffect(() => {
    if (!isLoading) {
      setLoadingMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex((prevIndex) => 
        (prevIndex + 1) % loadingMessages.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading, loadingMessages.length]);

  const handleServiceClick = (service) => {
    dispatch(setSelectedService(service));
    router.push(`/service-providers`);
  };

  const handleCitySubmit = () => {
    if (city.trim()) {
      setShowCityModal(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCitySubmit();
    }
  };

  // Function to get district from coordinates using Google Maps API
  const detectDistrictFromLocation = async () => {
    setLocationLoading(true);
    setLocationError("");
    try {
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by your browser");
        setLocationLoading(false);
        setShowCityModal(true);
        return;
      }
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
      // Use Google Maps Geocoding API
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      if (!response.ok) throw new Error("Failed to fetch location data");
      const data = await response.json();
      if (data.status !== "OK") throw new Error("Could not determine district from location");
      // Find district in address components
      let foundDistrict = "";
      for (const result of data.results) {
        for (const comp of result.address_components) {
          if (comp.types.includes("administrative_area_level_2")) {
            foundDistrict = comp.long_name;
            break;
          }
        }
        if (foundDistrict) break;
      }
      if (!foundDistrict) {
        // Fallback to city or administrative_area_level_1
        for (const result of data.results) {
          for (const comp of result.address_components) {
            if (comp.types.includes("locality") || comp.types.includes("administrative_area_level_1")) {
              foundDistrict = comp.long_name;
              break;
            }
          }
          if (foundDistrict) break;
        }
      }
      if (!foundDistrict) throw new Error("Could not extract district from location");
      setCity(foundDistrict);
      setShowCityModal(false);
    } catch (error) {
      setLocationError(error.message || "Could not detect your location. Please try again.");
      setShowCityModal(true);
    } finally {
      setLocationLoading(false);
    }
  };

  // Automatically detect location on mount
  useEffect(() => {
    if (!city && showCityModal) {
      detectDistrictFromLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen mx-auto py-8 font-poppins relative">
      {/* City Input Modal */}
      {showCityModal && !locationLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowCityModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <span className="text-2xl">🏠</span>
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Enter Your District
              </h2>
              <p className="text-gray-600 mb-6">
                We'll show you all the pet services available in your area
              </p>
              <input
                type="text"
                placeholder="e.g., Mumbai Suburban, Pune, Bengaluru Urban"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoFocus
                disabled={locationLoading}
              />
              <button
                onClick={handleCitySubmit}
                disabled={!city.trim() || locationLoading}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 mb-2"
              >
                Find Services
              </button>
              <button
                onClick={detectDistrictFromLocation}
                disabled={locationLoading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {locationLoading ? "Detecting Location..." : "Detect My Location"}
              </button>
              {locationError && <p className="text-red-500 mt-2">{locationError}</p>}
            </div>
          </div>
        </div>
      )}
      {showCityModal && locationLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowCityModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <span className="text-2xl">🐾</span>
              </div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Detecting your location...
              </h2>
              <p className="text-gray-600 mb-6">
                Please wait while we try to detect your district automatically.
              </p>
              <div className="w-full flex justify-center items-center">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
              </div>
              {locationError && <p className="text-red-500 mt-2">{locationError}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Service Providers in Your Area
          </h1>
          {city && (
            <>
              <h1 className="text-sm text-gray-500 mt-2 mb-4">
                Showing available services in{" "}
                <span className="font-medium">{city}</span>
              </h1>
              <button
                onClick={() => setShowCityModal(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
              >
                Change District
              </button>
            </>
          )}
        </div>

        {/* Filters - Only show if city is selected */}
        {city && (
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8 px-6">
            {/* Search Input */}
            <div className="flex items-center bg-white border border-gray-300 rounded-lg p-2 w-full max-w-md">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full outline-none text-gray-700"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Service Grid */}
        <div className="flex justify-start flex-wrap gap-6 max-sm:justify-center">
          {!city ? (
            <div className="w-full text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <span className="text-2xl">🐾</span>
              </div>
              <p className="text-lg text-gray-600 mb-4">Please enter your district to see available services</p>
              <button
                onClick={() => setShowCityModal(true)}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
              >
                Enter District
              </button>
            </div>
          ) : isLoading ? (
            <div className="w-full text-center py-12">
              {/* Animated Pet Paw Icon */}
              <div className="relative mb-6">
                <div className="inline-block animate-float">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-glow">
                    <span className="text-2xl">🐾</span>
                  </div>
                </div>
                {/* Orbiting dots */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
                </div>
                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="w-2 h-2 bg-red-300 rounded-full animate-bounce"></div>
                </div>
              </div>
              
              {/* Loading Message with Fade Animation */}
              <div className="min-h-[2rem] flex items-center justify-center">
                <p className="text-lg text-gray-700 font-medium animate-message-fade">
                  {loadingMessages[loadingMessageIndex]}
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6 max-w-md mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-progress-fill" 
                       style={{ width: `${((loadingMessageIndex + 1) / loadingMessages.length) * 100}%` }}>
                  </div>
                </div>
              </div>
              
              {/* Loading Dots */}
              <div className="mt-4 flex justify-center space-x-2">
                {[0, 1, 2].map((dot) => (
                  <div
                    key={dot}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      dot === loadingMessageIndex % 3 
                        ? 'bg-red-500 scale-125' 
                        : 'bg-gray-300'
                    }`}
                    style={{
                      animationDelay: `${dot * 0.2}s`,
                      animation: dot === loadingMessageIndex % 3 ? 'bounce 1s infinite' : 'none'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="w-full text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => setShowCityModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Try Different District
              </button>
            </div>
          ) : filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard
                key={service.createdAt}
                service={service}
                onClick={() => handleServiceClick(service)}
              />
            ))
          ) : (
            <div className="w-full text-center py-8">
              <p className="text-gray-500 mb-4">No services found in {city}.</p>
              <button
                onClick={() => setShowCityModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Try Different District
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtectedHomeRoute(Page);
