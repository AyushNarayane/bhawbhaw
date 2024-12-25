import React from "react";

const CustomLayoutPage = () => {
  return (
    <div className="bg-gray-50 text-white max-w-5xl font-poppins p-4 sm:p-8 space-y-6">
      {/* Full-width card */}
      <div className="bg-[#C4B0A9] items-center px-6 sm:px-10 rounded-[2.5rem] space-y-4 flex flex-col sm:flex-row justify-center items-start">
        <div className="bg-[#C4B0A9] rounded-[2.5rem] p-6 space-y-4 flex flex-col items-start">
          <h3 className="text-2xl sm:text-3xl font-semibold leading-relaxed text-white mb-2">
            Assess Your Dog’s Body Condition Score
          </h3>
          <button className="flex items-center pl-8 bg-[#F3EAE7] text-[#4D413E] px-4 py-2 rounded-full shadow-lg">
            Explore it
            <img src="/images/services/arrow1.png" alt="Arrow" className="ml-2 w-6 h-6" />
          </button>
        </div>
        <img
          src="/images/services/image1.png"
          alt="Grooming"
          className="w-full sm:w-96 rounded-lg"
        />
      </div>

      {/* Row with 3 columns (60% + 20% + 20%) */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        {/* 60% Column with 2 stacked cards */}
        <div className="flex flex-col space-y-4 w-full sm:w-3/5">
          {/* Healthcare Card */}
          <div className="bg-[#C4B0A9] rounded-[2.5rem] pb-2 px-4 sm:px-8 space-y-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Healthcare</h3>
              <p className="text-sm mt-4 text-white">
                Exact diagnosis of animal diseases:
                <ul className="list-disc pl-4 mt-1 text-white">
                  <li className="text-xs">Health checks</li>
                  <li className="text-xs">Complete analysis of blood and urine</li>
                  <li className="text-xs">Biochemical analysis of blood</li>
                  <li className="text-xs">Ultrasound and digital radiology (x-ray)</li>
                </ul>
              </p>
            </div>
            <img
              src="/images/services/image2.png"
              alt="Healthcare"
              className="hidden sm:block w-1/4 rounded-lg"
            />
            <button className="flex items-center text-white text-xl">
              <img src="/images/services/arrow1.png" alt="arrow" className="bg-[#F3EAE7] p-1 rounded-full w-8 h-8" />
            </button>
          </div>

          {/* Daycare Card */}
          <div className="bg-[#C4B0A9] items-center rounded-[2.5rem]  p-4 sm:px-8  flex justify-between">
            <div className="my-3">
              <h3 className="text-lg font-semibold text-white  mb-2">Daycare</h3>
              <p className="text-sm mt-4 text-white">
                Exact diagnosis of animal diseases:
                <ul className="list-disc pl-4 mt-1 text-white">
                  <li className="text-xs">Health checks</li>
                  <li className="text-xs">Complete analysis of blood and urine</li>
                  <li className="text-xs">Biochemical analysis of blood</li>
                  <li className="text-xs">Ultrasound and digital radiology (x-ray)</li>
                  <li className="text-xs">Biochemical analysis of blood</li>
                  <li className="text-xs">Ultrasound and digital radiology (x-ray)</li>
                </ul>
              </p>
            </div>
            <img
              src="/images/services/image3.png"
              alt="Healthcare"
              className="hidden sm:block w-1/4 rounded-lg"
            />
            <button className="flex items-center text-white text-xl">
              <img src="/images/services/arrow1.png" alt="arrow" className="bg-[#F3EAE7] p-1 rounded-full w-8 h-8" />
            </button>
          </div>
        </div>

        {/* 20% Column with 2 stacked cards */}
        <div className="flex flex-col space-y-4 w-full sm:w-1/5">
          {/* Consulting Card */}
          <div className="rounded-xl text-center">
            <img
              src="/images/services/image4.png"
              alt="Consulting"
              className="w-full rounded-lg"
            />
          </div>

          {/* Surgery Card */}
          <div className="rounded-xl text-center">
            <img
              src="/images/services/image5.png"
              alt="Surgery"
              className="w-full rounded-lg mb-4"
            />
          </div>
        </div>

        {/* Single 20% Column Card */}
        <div className="bg-[#C4B0A9] rounded-[2.5rem] py-7 p-2 w-full sm:w-1/5 h-full text-center flex flex-col items-center">
          <img
            src="/images/services/image6.png"
            alt="General animal care"
            className="w-full rounded-lg mb-4"
          />
          <p className="text-lg text-left text-white">Consulting services related to animal care</p>
          <img src="/images/services/arrow1.png" alt="arrow" className="bg-[#F3EAE7] p-1 rounded-full ml-32 w-8 h-8 mt-4" />
        </div>
      </div>

      {/* Full-width Grooming card at the end */}
      <div className="bg-[#C4B0A9] px-6 sm:px-16 rounded-[2.5rem] items-center p-2 space-y-4 flex flex-col sm:flex-row justify-between">
        <div>
          <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-2">Grooming</h3>
          <p className="text-sm w-full sm:w-72 text-white justify-between flex mb-8">
            <ul className="list-disc pl-4 mt-2 text-white">
              <li>Brushing</li>
              <li>Nail clipping</li>
              <li>Drying</li>
            </ul>
            <ul className="list-disc pl-4 mt-2 text-white">
              <li>Cleaning out ears</li>
              <li>Coat trimming</li>
              <li>Bathing</li>
            </ul>
          </p>
          <button className="flex items-center pl-8 bg-[#F3EAE7] text-[#4D413E] px-4 py-2 rounded-full shadow-lg">
            See more
            <img src="/images/services/arrow1.png" alt="Arrow" className="ml-2 w-6 h-6" />
          </button>
        </div>
        <img
          src="/images/services/image7.png"
          alt="Grooming"
          className="w-full sm:w-1/2 rounded-lg"
        />
      </div>
    </div>
  );
};

export default CustomLayoutPage;
