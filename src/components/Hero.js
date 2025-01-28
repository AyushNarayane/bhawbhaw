import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const PetPromoBanner = () => {
  const services = [
    { icon: "/images/Home/service1.png", title: "Pet Day Care" },
    { icon: "/images/Home/service2.png", title: "Veterinary" },
    { icon: "/images/Home/service3.png", title: "Pet Cafe" },
    { icon: "/images/Home/service4.png", title: "Dog Adoption" },
    { icon: "/images/Home/service5.png", title: "Rescue a Dog" },
  ];

  return (
    <>
      {/* <section className="relative bg-[#F3F4F6] pt-4 flex flex-wrap justify-center items-center">
        <div className="lg:w-1/2 w-full xl:pl-32 lg:pl-20 px-6 text-center lg:text-left">
          <h1 className="xl:text-6xl md:text-5xl sm:text-4xl max-w-xl lg:mx-0 mx-auto text-3xl !leading-tight font-extrabold text-black mb-4 font-prompt">
            Everything your pet deserves at one place!
          </h1>
          <p className="text-black lg:w-[75%] w-full font-montserrat max-w-xl sm:text-base text-xs xl:text-lg lg:text-sm mb-6 mx-auto lg:mx-0">
            From pet essentials to expert services, we connect you with trusted
            vendors who care about your pets as much as you do.
          </p>
          <button className="bg-[#FFEB3B] text-[#4D413E] font-semibold px-8 py-3 rounded-full flex items-center justify-center hover:bg-yellow-500 transition mx-auto lg:mx-0">
            Explore
            <img
              src="/images/Home/arrow.png"
              alt="Arrow"
              className="ml-2 w-5 h-5 object-contain"
            />
          </button>
        </div>

        <div className="relative sm:pr-32 pr-10 lg:w-1/2 w-full mt-6 lg:mt-0 flex justify-center">
          <div className="relative">
            <img
              src="/images/Home/hero.png"
              alt="Dog getting treat"
              className="lg:w-[50rem] lg:h-[34rem] w-full h-auto max-w-sm sm:max-w-2xl"
            />
            <div className="absolute font-prompt top-0 left-16 bg-[#E57A7A] text-white font-bold text-xl sm:text-5xl py-2 px-4 sm:py-3 sm:px-6 rounded-2xl -rotate-12 transform -translate-x-6 -translate-y-6">
              50%
            </div>
            <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 bg-purple-300 w-6 h-6 sm:w-8 sm:h-8 rotate-45"></div>
          </div>
        </div>
      </section> */}

      <section className="relative bg-[#F3F4F6] pt-4 flex flex-wrap justify-center items-center">
        {/* Carousel Section */}
        <div className="w-full px-6 lg:px-20">
          <Carousel
            showThumbs={false}
            autoPlay
            infiniteLoop
            showArrows
            showStatus={false}
            className="max-w-7xl mx-auto"
          >
            {/* Slide 1 */}
            <div className="flex flex-wrap justify-center items-center">
              <div className="lg:w-1/2 w-full text-center lg:text-left">
                <h1 className="xl:text-6xl md:text-5xl sm:text-4xl text-3xl !leading-tight font-extrabold text-black mb-4 font-prompt">
                  Everything your pet deserves at one place!
                </h1>
                <p className="text-black lg:w-[75%] w-full font-montserrat sm:text-base text-xs xl:text-lg lg:text-sm mb-6 mx-auto lg:mx-0">
                  From pet essentials to expert services, we connect you with
                  trusted vendors who care about your pets as much as you do.
                </p>
                <button className="bg-[#FFEB3B] text-[#4D413E] font-semibold px-8 py-3 rounded-full flex items-center justify-center hover:bg-yellow-500 transition mx-auto lg:mx-0">
                  Explore
                  <img
                    src="/images/Home/arrow.png"
                    alt="Arrow"
                    className="ml-2 w-5 h-5 object-contain"
                  />
                </button>
              </div>
              <div className="lg:w-1/2 w-full mt-6 lg:mt-0 flex justify-center">
                <img
                  src="/images/Home/image-1.png"
                  alt="Dog getting treat"
                  className="lg:w-[50rem] lg:h-[34rem] w-full h-auto max-w-sm sm:max-w-2xl"
                />
              </div>
            </div>

            {/* Slide 2 */}
            <div className="flex justify-center items-center">
              <img
                src="/images/Home/image-2.png"
                alt="Slide 2"
                className="w-full h-auto lg:w-[50rem] lg:h-[34rem] object-contain"
              />
            </div>

            {/* Slide 3 */}
            <div className="flex justify-center items-center">
              <img
                src="/images/Home/image-3.png"
                alt="Slide 3"
                className="w-full h-auto lg:w-[50rem] lg:h-[34rem] object-contain"
              />
            </div>

            {/* Slide 4 */}
            <div className="flex justify-center items-center">
              <img
                src="/images/Home/image-4.png"
                alt="Slide 4"
                className="w-full h-auto lg:w-[50rem] lg:h-[34rem] object-contain"
              />
            </div>
          </Carousel>
        </div>
      </section>
      <section className="relative bg-white py-16 px-4 md:px-8 mt-10">
        {/* Heading */}
        <h2 className="text-3xl md:text-6xl font-extrabold text-center text-black font-prompt mb-12">
          What <span className="text-[#E57A7A]">we</span> provide?
        </h2>

        {/* Service Cards */}
        <div className="flex flex-wrap justify-center lg:gap-14 gap-2">
          {services.map((service, index) => (
            <div
              key={index}
              className="w-36 h-36 md:w-40 md:h-40 flex flex-col items-center justify-center bg-white transition transform hover:scale-105"
            >
              <img
                src={service.icon}
                alt={service.title}
                className="w-20 h-20 md:w-32 md:h-32 object-contain mb-4"
              />
              <p className="text-center text-md font-semibold font-poppins md:text-base text-gray-800">
                {service.title}
              </p>
            </div>
          ))}
          <img
            src="/images/Home/line.png"
            alt="Expert Services for pet"
            className="absolute left-0 -top-20 w-20 h-20 md:w-32 md:h-32 sm:mt-6 mt-0 object-contain mb-4"
          />
          <img
            src="/images/Home/line.png"
            alt="Expert Services for pet"
            className="absolute right-20 top-4 w-20 h-20 md:w-32 md:h-32 sm:mt-6 mt-0 object-contain mb-4"
          />
          <img
            src="/images/Home/star.png"
            alt="Expert Services for pet"
            className="absolute top-0 right-10 w-10 md:h-10 sm:mt-6 mt-0 object-contain mb-4"
          />
          <img
            src="/images/Home/star.png"
            alt="Expert Services for pet"
            className="absolute top-8 left-10 w-10 md:h-10 sm:mt-6 mt-0 object-contain mb-4"
          />
        </div>
      </section>
    </>
  );
};

export default PetPromoBanner;
