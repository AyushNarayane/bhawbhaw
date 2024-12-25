import React from "react";
import BodyConditionScore from '@/components/BodyCondition'

const SearchServices = () => {
  return (
    <div className="relative bg-white font-montserrat">
      {/* Background Image Section */}
      <div className="bg-cover bg-center h-80 relative" style={{ backgroundImage: 'url("/images/searchservice/background.png")' }}>
        <div className="absolute "></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          {/* Search Bar Section */}
          <h1 className="text-white text-2xl font-bold mb-6">SEARCH SERVICES</h1>

          <div className="flex pl-3 items-center bg-white shadow-md rounded-full w-3/4 md:w-1/2">
            <input
              type="text"
              className="flex-grow px-4 py-2 text-gray-700 rounded-l-full focus:outline-none"
              placeholder="search here"
            />
            <button className="pr-4">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Service Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-[-3rem] relative z-20 mx-10  p-6">
        <div className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <div className="bg-[#F3EAE7] w-28 h-28 flex items-center justify-center rounded-3xl mb-4">
            <img src="/images/searchservice/image2.png" alt="Health Care" className="w-20 h-20" />
          </div>
          <p className="text-center font-semibold text-black">Health care</p>
        </div>

        <div className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <div className="bg-[#F3EAE7] w-28 h-28 flex items-center justify-center rounded-3xl mb-4">
            <img src="/images/searchservice/image2.png" alt="Daycare" className="w-20 h-20" />
          </div>
          <p className="text-center font-semibold text-black">Daycare</p>
        </div>

        <div className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <div className="bg-[#F3EAE7] w-28 h-28 flex items-center justify-center rounded-3xl mb-4">
            <img src="/images/searchservice/image3.png" alt="Grooming" className="w-20 h-20" />
          </div>
          <p className="text-center font-semibold text-black">Grooming</p>
        </div>

        <div className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <div className="bg-[#F3EAE7] w-28 h-28 flex items-center justify-center rounded-3xl mb-4">
            <img src="/images/searchservice/image4.png" alt="Doctor Consultancy" className="w-20 h-20" />
          </div>
          <p className="text-center font-semibold text-black">Doctor Consultancy</p>
        </div>
      </div>
      <BodyConditionScore/>
    </div>
  );
};

export default SearchServices;
