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
  const [hasSubmittedCity, setHasSubmittedCity] = useState(false);

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
    if (!hasSubmittedCity) return;

    const fetchServices = async () => {
      try {
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
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [city, hasSubmittedCity]);

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

  const handleServiceClick = (service) => {
    dispatch(setSelectedService(service));
    router.push(`/service-providers`);
  };

  // Show city input first
  if (!hasSubmittedCity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-poppins">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Enter Your City
        </h2>
        <input
          type="text"
          placeholder="e.g., Mumbai"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-64 text-gray-700 mb-4"
        />
        <button
          onClick={() => setHasSubmittedCity(true)}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
        >
          Show Services
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen mx-auto py-8 font-poppins">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Explore Our Services
        </h1>
        <h1 className="text-sm text-gray-500 text-center mt-2 mb-6">
          Showing available services in{" "}
          <span className="font-medium">{city}</span>
        </h1>

        {/* Filters */}
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

        {/* Service Grid */}
        <div className="flex justify-start flex-wrap gap-6 max-sm:justify-center">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard
                key={service.createdAt}
                service={service}
                onClick={() => handleServiceClick(service)}
              />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No services found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtectedHomeRoute(Page);
