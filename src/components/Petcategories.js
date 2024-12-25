
'use client'
import React, { useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';

const PetCategories = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const handleFilterClick = (item) => {
    setSelectedFilter(item);
  };

  return (
    <div className="font-poppins bg-white px-5 flex flex-col items-center">
      
      {/* Header Section */}
      <div className="flex justify-end px-10 w-full">
        <div className="flex items-center">
          <h1 className="text-3xl text-[#4D413E] -mr-10 leading-10 text-right">
            Find What Your Pet Needs. <br /> Here To Make Your <br/> Pet Happy
          </h1>
          <img
            src="images/hero/image.png"
            alt="Dog's toy with 3 pieces of rope"
            className="w-72"
          />
        </div>
      </div>

      {/* Category Section */}
      <div className="w-full -mt-8">
        <h3 className='text-2xl pl-4 text-black'>Categories</h3>
        <div className="flex justify-center space-x-[0.1rem] w-full overflow-x-auto pb-4">
          {/* Category Cards */}
          {[
            { name: 'Cats', img: 'images/hero/cat.png' },
            { name: 'Dogs', img: 'images/hero/dog.png' },
            { name: 'Parrots', img: 'images/hero/parrot.png' },
            { name: 'Hamsters', img: 'images/hero/hamester.png' },
            { name: 'Fishes', img: 'images/hero/fish.png' },
            { name: 'Other Pets', img: 'images/hero/other.png' }
          ].map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-[#F3EAE7] rounded-lg p-4 w-72"
            >
              <img src={category.img} alt={category.name} className="w-24 h-24 object-contain" />
              <span className="mt-2 text-black font-medium">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Section with Images and Divider */}
      <div className="flex items-center mt-4 space-x-4 flex-wrap justify-center">
        <img src="images/hero/search.png" alt="Left Image" className="w-12 h-12" />
        
        {/* Vertical Line */}
        <div className="border-l border-gray-400 h-8 mx-4"></div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          {['All', 'Foods', 'Clothes', 'Toys', 'Vitamins', 'Shampoo', 'Collars', 'Bowls', 'Beds', 'Treats', 'Containers'].map(
            (item, index) => (
              <button
                key={index}
                onClick={() => handleFilterClick(item)}
                className={`p-2 rounded-full text-black text-sm ${
                  selectedFilter === item ? 'bg-yellow-400 ' : ''
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>
        
        {/* Vertical Line */}
        <div className="border-l border-gray-400 h-8 mx-4"></div>
        
        <img src="images/hero/setting.png" alt="Right Image" className="w-8 h-8" />

        {/* Extra Button */}
        <button className="px-3 rounded-full bg-[#FFEB3B]">         <img src="images/hero/arrow.png" alt="Left Image" className="w-8 h-8" />  </button>     
      </div>
    </div>
  );
};

export default PetCategories;
