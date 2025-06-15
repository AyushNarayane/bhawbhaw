"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import ProductCard from "./ProductCard";

export default function ProductCarousel() {
  const [productData, setProductData] = useState([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [navigationReady, setNavigationReady] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/getProducts");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const products = await response.json();
        setProductData(products.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Ensure refs are set before rendering Swiper
  useEffect(() => {
    if (prevRef.current && nextRef.current) {
      setNavigationReady(true);
    }
  }, [prevRef, nextRef]);

  const activeProducts = productData.filter(
    (product) => product.status === "active"
  );

  return (
    <div className="relative px-4 py-16 font-prompt bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">
          Featured <span className="text-red-500">Products</span>
        </h2>

        <div className="absolute right-4 top-0 flex items-center gap-3 z-10 mt-8">
          <button ref={prevRef} className="custom-prev-arrow bg-white text-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110">
            &#10094;
          </button>
          <button ref={nextRef} className="custom-next-arrow bg-white text-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110">
            &#10095;
          </button>
        </div>

        {navigationReady && (
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onInit={(swiper) => {
              // @ts-ignore
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-ignore
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 1,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={3500}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="pb-12"
          >
            {activeProducts.map((product) => (
              <SwiperSlide key={product.productId} className="my-8 scale-90 md:scale-95 lg:scale-100 max-w-xs">
                <ProductCard
                  product={product}
                  addToCart={() => addToCart(product)}
                  addToWishlist={() => addToWishlist(product)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <div className="flex justify-center mt-12">
          <a
            href="/products"
            className="bg-red-500 text-white px-8 py-3 rounded-xl hover:bg-red-600 transition-all duration-300 font-semibold text-lg transform hover:-translate-y-1 hover:shadow-lg"
          >
            View All Products
          </a>
        </div>
      </div>
    </div>
  );
}
