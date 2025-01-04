import React from 'react';
import Link from "next/link";
import Image from 'next/image';

const PetJoySection = () => {
  return (
    <div className='bg-white relative font-poppins'>
      <section className="relative flex flex-col items-center justify-center text-center lg:pt-24 py-4 lg:py-12 lg:px-4 bg-white">
        {/* Main Content */}
        <div className="z-10 max-w-2xl md:max-w-5xl">
          <h1 className="text-4xl md:text-7xl font-bold my-4 font-staatliches text-[#4D413E]">
            WHERE EVERY
          </h1>
          <h1 className="text-4xl md:text-7xl font-bold mb-4 font-staatliches text-[#4D413E]">
            PET&apos;S JOY BEGINS!
          </h1>
          <p className="text-[#4D413E] text-base md:text-lg mb-3 mx-4 lg:mx-64 md:mx-0 md:mb-6 font-poppins">
            We know your pets are cherished members of your family.
            That&apos;s why we provide loving, personalized pet sitting
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
            <Image
              height={120}
              width={120}
              src="/images/services/pet2.png"
              alt="Pet 1"
              className="object-cover w-full h-full"
            />
          </div>
          <span className="absolute -top-6 left-48 transform -translate-x-1/2 mt-2 bg-white text-[#4D413E] px-2 text-base font-semibold hidden lg:block">
            Groomer
          </span>

          {/* Left Image */}
          <div className="absolute -left-5 md:-left-10 top-[75%] md:top-[78%] transform -translate-y-1/2 -translate-x-4 md:-translate-x-8 w-24 h-24 md:w-36 md:h-36 rounded-full border-4 md:border-8 border-[#e57373] overflow-hidden hidden lg:block">
            <Image
              height={120}
              width={120}
              src="/images/services/pet4.png"
              alt="Pet 4"
              className="object-cover w-full h-full"
            />
          </div>
          <span className="absolute -left-52 top-[19rem] ml-3 bg-white text-[#4D413E] px-2 text-base font-semibold hidden lg:block">
            Dog Walker
          </span>

          {/* Right Image */}
          <div className="absolute -right-4 md:-right-8 top-[74%] md:top-[77%] transform -translate-y-1/2 translate-x-4 md:translate-x-8 w-20 h-20 md:w-32 md:h-32 rounded-full border-4 md:border-8 border-[#a0df6d] overflow-hidden hidden lg:block">
            <Image
              height={120}
              width={120}
              src="/images/services/pet5.png"
              alt="Pet 5"
              className="object-cover w-full h-full"
            />
          </div>
          <span className="absolute -right-48 top-72 mr-3 bg-white text-[#4D413E] px-2 text-base font-semibold hidden lg:block">
            Veterinary
          </span>

          {/* Top Left Image */}
          <div className="absolute -top-2 md:-top-3 -left-6 md:-left-10 w-24 h-24 md:w-40 md:h-40 rounded-full border-4 md:border-8 border-[#febf03] overflow-hidden hidden lg:block">
            <Image
              height={120}
              width={120}
              src="/images/services/pet1.png"
              alt="Pet 1"
              className="object-cover w-full h-full"
            />
          </div>
          <span className="absolute -left-32 top-16 ml-3 bg-white text-[#4D413E] px-2 text-base font-semibold hidden lg:block">
            Trainer
          </span>

          {/* Top Right Image */}
          <div className="absolute -top-1 md:-top-0 right-2 md:right-4 w-20 h-20 md:w-28 md:h-28 rounded-full border-4 md:border-8 border-[#febf03] overflow-hidden hidden lg:block">
            <Image
              height={120}
              width={120}
              src="/images/services/pet3.png"
              alt="Pet 3"
              className="object-cover w-full h-full"
            />
          </div>
          <span className="absolute -right-24 top-12 mr-3 bg-white text-[#4D413E] px-2 text-base font-semibold hidden lg:block">
            Day Care
          </span>

          <span className="absolute -bottom-8 left-16 mr-3 bg-white text-[#4D413E] px-2 text-base font-semibold hidden lg:block">
            Events
          </span>
          <span className="absolute -bottom-12 left-72 mr-3 bg-white text-[#4D413E] px-2 text-base font-semibold hidden lg:block">
            Volunteers
          </span>
          <span className="absolute -bottom-8 right-4 mr-3 bg-white text-[#4D413E] px-2 text-base font-semibold hidden lg:block">
            Help
          </span>
        </div>
      </section>
    </div>
  );
};

export default PetJoySection;
