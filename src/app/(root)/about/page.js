import ConnectNewsletter from "@/components/ConnectNewsletter";
import React from "react";

const PetCareSection = () => {
  return (
    <section className="bg-[#fcfcfc]">
      {/* Main Title and Image Section */}
      <div className="text-center relative mx-auto">
        {/* Hero Image (Hidden on small screens) */}
        <div className="relative flex justify-center">
          <img
            src="/images/about/hero1.png"
            alt="Happy dog"
            className="w-full max-w-[45rem] h-auto hidden lg:block" // Hidden on small screens
          />
          {/* Additional Image Overlaid on Hero Image */}
          <div className="absolute lg:mt-72 mt-52  inset-0 flex justify-center items-center">
            <img
              src="/images/about/hero2.png"
              alt="Another happy pet"
              className="w-[23rem] max-w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="relative mb-7 lg:mb-16 mt-52 md:mt-32 flex flex-col lg:flex-row items-center justify-center">
        <div className="flex justify-center mb-6 lg:mb-0 lg:mr-8">
          <img
            src="/images/about/image.png"
            alt="Pet 1"
            className="h-[30rem] w-[30rem] mt-52 rounded object-contain max-w-full max-h-[30rem]"
          />
        </div>

        {/* Text on the right */}
        <div className="text-right pl-4 pr-10 w-full lg:w-1/2">
          <h2 className="text-4xl font-poppins text-[#4D413E] mb-4 flex justify-end items-center">
            <img
              src="images/about/paw.png"
              alt="Paw Icon"
              className="w-12 h-12 mr-4"
            />
            Our Story
          </h2>
          <p className="text-[#85716B] text-2xl lg:text-3xl font-kiwi leading-10 lg:leading-[2.6rem]">
            BhawBhaw was born out of a deep love for animals of all kinds. Our
            founders realized that while pet care was improving for dogs and
            cats, there were fewer trusted options for fish, birds, and small
            pets. BhawBhaw was created to bridge that gap.
          </p>
          <button className="bg-[#4D413E] rounded-full text-white px-10 py-2 mt-6 font-poppins hover:bg-gray-700">
            Read More
          </button>
        </div>
      </div>

      {/* Bottom Illustrations */}
      <div className="flex flex-wrap pt-10 justify-evenly lg:pb-32 space-x-6">
        <img
          src="images/about/bottom1.png"
          alt="Cat doodle 1"
          className="w-52 h-52 mb-4 md:mb-0"
        />
        <img
          src="images/about/bottom2.png"
          alt="Dog doodle 2"
          className="w-52 h-52 mb-4 md:mb-0"
        />
        <img
          src="images/about/bottom3.png"
          alt="Person with pet"
          className="w-52 h-52 mb-4 md:mb-0"
        />
      </div>
      <ConnectNewsletter />
    </section>
  );
};

export default PetCareSection;
