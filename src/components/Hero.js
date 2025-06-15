"use client";

import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai"; 
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseConfig"; 

const PetPromoBanner = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const docRef = doc(db, "bannerImages", "nB2dreUyJqB3OwGvhX1o");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Extract the image URLs (Fields are named banner1, banner2, etc.)
        const bannerUrls = Object.keys(docSnap.data()).map(key => docSnap.data()[key]);
        
        // Set the images state to the array of URLs
        setImages(bannerUrls);
        // console.log(bannerUrls);
        
      } else {
        console.log("No such document!");
      }
    };

    fetchImages();
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white pt-4 flex flex-wrap justify-center items-center">
      {/* Carousel Section */}
      <div className="w-full px-4 lg:px-16">
        <Carousel
          showThumbs={false}
          infiniteLoop={true}
          transitionTime={1000}
          autoPlay={true}
          showStatus={false}
          className="max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
          renderArrowPrev={(clickHandler, hasPrev) =>
            hasPrev && (
              <button
                onClick={clickHandler}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition z-10"
              >
                <AiOutlineLeft size={32} />
              </button>
            )
          }
          renderArrowNext={(clickHandler, hasNext) =>
            hasNext && (
              <button
                onClick={clickHandler}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition z-10"
              >
                <AiOutlineRight size={32} />
              </button>
            )
          }
        >
          {images.length > 0 ? (
            images.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={image}
                  alt={`Banner ${index + 1}`}
                  width={1920}
                  height={800}
                  className="w-full h-[32rem] lg:h-[40rem] object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-[32rem] lg:h-[40rem] bg-gray-100">
              <p className="text-gray-500 text-lg">Loading banners...</p>
            </div>
          )}
        </Carousel>
      </div>
    </section>
  );
};

export default PetPromoBanner;
