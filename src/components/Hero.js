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
    <section className="relative bg-[#F3F4F6] pt-4 flex flex-wrap justify-center items-center">
      {/* Carousel Section */}
      <div className="w-full px-6 lg:px-20">
        <Carousel
          showThumbs={false}
          infiniteLoop={true}
          transitionTime={1000}
          autoPlay={true}
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
          {/* Dynamically render carousel slides */}
          {images.length > 0 ? (
            images.map((image, index) => (
              <div key={index} className="flex justify-center items-center">
                <Image
                  src={image} // Use the image URL fetched from Firestore
                  alt={`Banner ${index + 1}`}
                  width={800}
                  height={800}
                  className="w-full h-auto lg:h-[34rem] object-contain"
                />
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center">
              <p>Loading banners...</p>
            </div>
          )}
        </Carousel>
      </div>
    </section>
  );
};

export default PetPromoBanner;
