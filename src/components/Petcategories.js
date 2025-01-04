'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';

const pets = [
  { name: 'Cats', img: '/images/hero/cat.png' },
  { name: 'Dogs', img: '/images/hero/dog.png' },
  { name: 'Parrots', img: '/images/hero/parrot.png' },
  { name: 'Hamsters', img: '/images/hero/hamester.png' },
  { name: 'Fishes', img: '/images/hero/fish.png' },
  { name: 'Other Pets', img: '/images/hero/other.png' }
];

const categories = [
  { name: "Caller and Harness" },
  { name: "Crates" },
  { name: "Ticks and Flea" },
  { name: "Grooming Supply" },
  { name: "Treats" },
  { name: "Clothing and Shoes" },
  { name: "Cleaning Supplies" },
  { name: "Puppy Supplies" },
  { name: "Bowls and Feeders" },
  { name: "Training and Behaviour" },
  { name: "Pet Food" },
  { name: "Pet Furnitures" },
  { name: "Aquariums and Tanks" },
  { name: "Illuminations" },
  { name: "Heaters, and Regulators" },
  { name: "Equipment and Ornaments" },
  { name: "Water Plants" },
  { name: "Health Treatments" },
  { name: "Aquarium Services and Maintenance" },
  { name: "Fish Food and Aquarium Food" },
  { name: "Aerators, Filters, and Pumps" },
  { name: "Measuring Instruments" },
  { name: "Natural and Artificial Stones, Pebbles" },
  { name: "Fertilizers and Plant Protection" }
];

const filterButtons = ["All", "Foods", "Clothes", "Toys", "Vitamins", "Shampoo", "Collars", "Bowls", "Beds", "Treats", "Containers"];

const PetCategories = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const handleFilterClick = (item) => {
    setSelectedFilter(item);
  };

  return (
    <div className="font-poppins bg-white px-5 flex flex-col items-center overflow-hidden">

      {/* Header Section */}
      <div className="flex justify-end px-10 w-full my-4">
        <div className="flex items-center justify-center">
          <h1 className="text-base md:text-3xl text-[#4D413E] font-semibold -mr-6 md:leading-10 text-right whitespace-nowrap">
            <span className='whitespace-normal'>
              Find What Your Pet Needs Here.
            </span>
            <br /> To Make Your
            <br /> Pet Happy
          </h1>
          <Image
            height={200}
            width={200}
            src="/images/hero/image.png"
            alt="Dog's toy with 3 pieces of rope"
            className="md:w-72 w-52"
          />
        </div>
      </div>

      {/* Category Section */}
      <div className="w-full">
        <h3 className="text-2xl mb-4 font-semibold text-black text-center">Categories</h3>
        <div className="flex justify-center gap-3 flex-wrap w-full pb-2">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md px-4 py-2 shadow-sm transition-all duration-200 text-sm"
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>

      <div className='w-full h-px bg-gray-300 mt-4'/>

      {/* Filter Section with Images and Divider */}
      <div className="flex items-center mt-4 space-x-4 flex-wrap justify-center gap-4 pb-2">
        {/* Left Image */}
        <Image
          height={100}
          width={100}
          src="/images/hero/search.png"
          alt="Search Icon"
          className="size-12 md:size-16"
        />

        {/* Divider */}
        <div className="hidden md:block border-l border-gray-400 h-10 mx-4"></div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 justify-center bg-gray-100 px-3 py-2 rounded-3xl shadow-sm">
          {filterButtons.map((item, index) => (
            <button
              key={index}
              onClick={() => handleFilterClick(item)}
              className={`py-2 px-4 rounded-2xl text-sm font-medium transition duration-300 ${selectedFilter === item
                ? "bg-yellow-400 text-white"
                : "bg-white text-gray-700 hover:bg-yellow-100"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden md:block border-l border-gray-400 h-10 mx-4"></div>

        {/* Right Image */}
        <Image
          height={100}
          width={100}
          src="/images/hero/setting.png"
          alt="Settings Icon"
          className="size-10 md:size-12"
        />

        <button className="flex items-center justify-center size-10 bg-yellow-400 rounded-full shadow-md md:w-12 md:h-12 hover:bg-yellow-500">
          <Image
            height={100}
            width={100}
            src="/images/hero/arrow.png"
            alt="Arrow Icon"
            className="size-6 md:size-8"
          />
        </button>
      </div>
    </div>
  );
};

export default PetCategories;
