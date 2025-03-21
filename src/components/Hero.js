import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai"; // Import big icons

const PetPromoBanner = () => {
  const services = [
    { icon: "/images/Home/service1.png", title: "Pet Day Care" },
    { icon: "/images/Home/service2.png", title: "Veterinary" },
    { icon: "/images/Home/service3.png", title: "Pet Cafe" },
    { icon: "/images/Home/service4.png", title: "Dog Adoption" },
    { icon: "/images/Home/service5.png", title: "Rescue a Dog" },
  ];

  // const [images, setImages] = useState([]);

  // useEffect(() => {
  //   const fetchImages = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "bannerImgs"));
  //       const imageUrls = querySnapshot.docs.map(doc => doc.data().imageUrl);
  //       setImages(imageUrls);
  //     } catch (error) {
  //       console.error("Error fetching images from Firebase: ", error);
  //     }
  //   };

  //   fetchImages();
  // }, []);

  return (
    <section className="relative bg-[#F3F4F6] pt-4 flex flex-wrap justify-center items-center">
      {/* Carousel Section */}
      <div className="w-full px-6 lg:px-20">
        <Carousel
          showThumbs={false}
          infiniteLoop
          autoPlay
          showStatus={false}
          className="max-w-7xl mx-auto"
          renderArrowPrev={(clickHandler, hasPrev) =>
            hasPrev && (
              <button
                onClick={clickHandler}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-900/50 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition z-10"
              >
                <AiOutlineLeft size={40} />
              </button>
            )
          }
          renderArrowNext={(clickHandler, hasNext) =>
            hasNext && (
              <button
                onClick={clickHandler}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-900/50 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition z-10"
              >
                <AiOutlineRight size={40} />
              </button>
            )
          }
        >
          {/* Slide 1 */}
          <div className="flex flex-wrap justify-center items-center">
            {/* <div className="lg:w-1/2 w-full text-center lg:text-left">
              <h1 className="lg:text-6xl md:text-5xl sm:text-4xl text-2xl font-extrabold text-black mb-4 md:mb-[5rem] font-prompt">
                Everything your pet deserves at one place!
              </h1>
              <p className="text-black lg:w-[75%] w-full font-montserrat lg:text-lg md:text-base text-sm mb-6 mx-auto lg:mx-0">
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
            </div> */}
            <div className=" w-full mt-6 lg:mt-0 flex justify-center">
              <Image
                src="/images/Home/banner1.jpg"
                alt="Dog getting treat"
                width={800}
                height={800}
                className="w-full h-auto lg:h-[34rem] object-contain"
              />
            </div>
          </div>

          {/* Slide 2 */}
          <div className="flex justify-center items-center">
            <Image
              src="/images/Home/Image-2.png"
              alt="Slide 2"
              width={800}
              height={800}
              className="w-full h-auto lg:h-[34rem] object-contain"
            />
          </div>

          {/* Slide 3 */}
          <div className="flex justify-center items-center">
            <Image
              src="/images/Home/Image-3.png"
              alt="Slide 3"
              width={800}
              height={800}
              className="w-full h-auto lg:h-[34rem] object-contain"
            />
          </div>

          {/* Slide 4 */}
          <div className="flex justify-center items-center">
            <Image
              src="/images/Home/Image-4.png"
              alt="Slide 4"
              width={1200}
              height={800}
              className="w-full h-auto lg:h-[34rem] object-contain"
            />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default PetPromoBanner;

{
  /* <section className="relative bg-[#F3F4F6] pt-4 flex flex-wrap justify-center items-center">
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
      </section> */
}
