import React from 'react';
import Link from "next/link";

const PetJoySection = () => {
  return (
    <div className='bg-white'>
      <section className="relative flex flex-col items-center justify-center text-center lg:pt-24 py-4 lg:py-12 lg:px-4 bg-white">
        {/* Main Content */}
        <div className="z-10 max-w-2xl md:max-w-5xl">
          <h1 className="text-4xl md:text-7xl font-bold mb-4 font-staatliches text-[#4D413E]">
            WHERE EVERY 
          </h1>
          <h1 className="text-4xl md:text-7xl font-bold mb-4 font-staatliches text-[#4D413E]">
            PET&apos;S JOY BEGINS!
          </h1>
          <p className="text-[#4D413E] text-base md:text-lg mb-3 mx-4 lg:mx-64 md:mx-0 md:mb-6 font-poppins">
            We know your pets are cherished members of your family.
            That’s why we provide loving, personalized pet sitting
            services tailored to their needs.
          </p>
          <Link href="/book-service">
            <button className="bg-[#FFEB3B] font-poppins text-black px-4 py-2 rounded-md text-sm md:text-base">
              Book Now
            </button>
          </Link>
        </div>

        {/* Circular Images */}
        <div className="absolute w-[300px] h-[200px] md:w-[600px] md:h-[400px] flex items-center justify-center">
          {/* Top Image */}
          <div className="absolute -top-24 lg:-top-16 left-1/2 transform -translate-x-1/2 w-20 h-20 md:w-28 md:h-28 rounded-full border-4 md:border-8 border-[#e57373] overflow-hidden hidden lg:block">
            <img src="images/services/pet2.png" alt="Pet 1" className="object-cover w-full h-full" />
          </div>

          {/* Left Image */}
          <div className="absolute -left-5 md:-left-10 top-[75%] md:top-[78%] transform -translate-y-1/2 -translate-x-4 md:-translate-x-8 w-24 h-24 md:w-36 md:h-36 rounded-full border-4 md:border-8 border-[#e57373] overflow-hidden hidden lg:block">
            <img src="images/services/pet4.png" alt="Pet 3" className="object-cover w-full h-full" />
          </div>

          {/* Right Image */}
          <div className="absolute -right-4 md:-right-8 top-[74%] md:top-[77%] transform -translate-y-1/2 translate-x-4 md:translate-x-8 w-20 h-20 md:w-32 md:h-32 rounded-full border-4 md:border-8 border-[#a0df6d] overflow-hidden hidden lg:block">
            <img src="images/services/pet5.png" alt="Pet 4" className="object-cover w-full h-full" />
          </div>

          {/* Top Left Image */}
          <div className="absolute -top-2 md:-top-3 -left-6 md:-left-10 w-24 h-24 md:w-40 md:h-40 rounded-full border-4 md:border-8 border-[#febf03] overflow-hidden hidden lg:block">
            <img src="images/services/pet1.png" alt="Pet 5" className="object-cover w-full h-full" />
          </div>

          {/* Top Right Image */}
          <div className="absolute -top-1 md:-top-0 right-2 md:right-4 w-20 h-20 md:w-28 md:h-28 rounded-full border-4 md:border-8 border-[#febf03] overflow-hidden hidden lg:block">
            <img src="images/services/pet3.png" alt="Pet 6" className="object-cover w-full h-full" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PetJoySection;
