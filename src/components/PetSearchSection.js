import React from "react";

const PetSearchSection = () => {
  return (
    <div className="bg-white p-12 ">
    <section className="relative bg-[#1B1E2D] rounded-lg py-10 px-8 flex justify-between items-center">
      {/* Left Text Section */}
      <div className="text-white w-1/2">
        <h2 className="text-5xl font-semibold font-prompt ml-12">
          Wholesome Care for Every Pet, Every Meal with
        </h2>
        <div className="mt-4">
          <img
            src="/images/logo.png"
            alt="Bhaw Bhaw Logo"
            className="w-32 h-auto inline-block"
          />
          <span className="inline-block ml-4 text-white text-2xl">✦</span>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="bg-white rounded-lg flex items-center p-4 shadow-md">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <span className="text-gray-400 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 20l6-6m0 0l6-6m-6 6H4"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search for pet query"
            className="bg-gray-100 text-gray-600 text-lg focus:outline-none"
          />
        </div>
        <button className="bg-[#E88A7D] text-white font-semibold ml-4 px-6 py-2 rounded-full">
          Search
        </button>
      </div>
    </section>
    </div>
  );
};

export default PetSearchSection;
