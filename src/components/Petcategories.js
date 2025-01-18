'use client';
import Image from 'next/image';
import React, { useState } from 'react';

const pets = [
  {
    name: 'Cats',
    img: '/images/hero/cat.png',
    categories: ['Grooming Supply', 'Clothing and Shoes', 'Bowls and Feeders']
  },
  {
    name: 'Dogs',
    img: '/images/hero/dog.png',
    categories: ['Collar and Harness', 'Training and Behaviour', 'Dog Food']
  },
  {
    name: 'Parrots',
    img: '/images/hero/parrot.png',
    categories: ['Treats', 'Cages', 'Bird Food']
  },
  {
    name: 'Hamsters',
    img: '/images/hero/hamester.png',
    categories: ['Cages', 'Treats', 'Chewing Toys']
  },
  {
    name: 'Fishes',
    img: '/images/hero/fish.png',
    categories: ['Aquariums and Tanks', 'Fish Food', 'Water Plants']
  },
  {
    name: 'Other Pets',
    img: '/images/hero/other.png',
    categories: ['Health Treatments', 'Cleaning Supplies', 'Toys']
  },
];

const PetCategories = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const handlePetClick = (pet) => {
    setSelectedPet(pet.name);
    setFilteredCategories(pet.categories);
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

      {/* Pets Section */}
      <div className="w-full">
        <h3 className="text-2xl mb-4 font-semibold text-black text-center">Pets</h3>
        <div className="flex justify-center gap-3 flex-wrap w-full pb-2">
          {pets.map((pet) => (
            <div
              key={pet.name}
              onClick={() => handlePetClick(pet)}
              className={`flex flex-col justify-evenly items-center cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md px-4 py-2 shadow-sm transition-all duration-100 text-sm size-48 ${selectedPet === pet.name ? 'bg-yellow-400 text-white' : ''}`}>
              <Image
                src={pet.img}
                alt={pet.name}
                height={100}
                width={100}
                className="mb-2"
              />
              <span>{pet.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="w-full">
        <h3 className="text-2xl my-4 font-semibold text-black text-center">Categories</h3>
        <div className="flex justify-center gap-3 flex-wrap w-full pb-2">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md px-4 py-2 shadow-sm transition-all duration-200 text-sm"
              >
                {category}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Please select a pet to see related categories.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetCategories;
