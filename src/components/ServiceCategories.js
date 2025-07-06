"use client";

import Image from "next/image";
import React, { useState } from "react";

const serviceCategories = [
  {
    name: "Pet Grooming Services",
    img: "/images/service_categories/1.jpg",
  },
  {
    name: "Pet Boarding and Daycare",
    img: "/images/service_categories/2.jpg",
  },
  {
    name: "Pet Training Services",
    img: "/images/service_categories/3.jpg",
  },
  {
    name: "Pet Walking and Exercise",
    img: "/images/service_categories/4.jpg",
  },
  {
    name: "Veterinary and Health Services",
    img: "/images/service_categories/5.jpg",
  },
  {
    name: "Pet Transportation Services",
    img: "/images/service_categories/6.jpg",
  },
  {
    name: "Pet Nutrition Services",
    img: "/images/service_categories/7.jpg",
  },
  {
    name: "Specialized Care",
    img: "/images/service_categories/8.jpg",
  },
  {
    name: "Pet Adoption and Rescue Services",
    img: "/images/service_categories/9.jpg",
  },
  {
    name: "Pet Photography and Art",
    img: "/images/service_categories/10.jpg",
  },
  {
    name: "Pet Accessories and Supplies",
    img: "/images/service_categories/11.jpg",
  },
  {
    name: "All",
    img: "/images/service_categories/12.jpg",
  },
];

const ServiceCategories = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.name);
    onSelectCategory(category.name);
  };

  return (
    <div className="w-full mb-8">
      <h3 className="text-2xl mb-4 font-semibold text-black text-center">
        Service Categories
      </h3>
      <div className="flex justify-center gap-3 flex-wrap w-full pb-2">
        {serviceCategories.map((category) => (
          <div
            key={category.name}
            onClick={() => handleCategoryClick(category)}
            className={`flex flex-col justify-evenly items-center cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md px-4 py-2 shadow-sm transition-all duration-100 text-sm size-48 ${selectedCategory === category.name ? "bg-yellow-400 text-white" : ""}`}
          >
            <Image
              src={category.img}
              alt={category.name}
              height={100}
              width={100}
              className="mb-2"
            />
            <span>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCategories;
