"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProductCard from "./ProductCard";

export default function ProductCarousel() {
  const [productData, setProductData] = useState([]);

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

  const activeProducts = productData.filter(
    (product) => product.status === "active"
  );

  return (
    <div className="relative px-4 py-8 font-prompt">
      <h2 className="text-4xl font-bold text-center mb-6">
        <span className="text-red-500">Products</span>
      </h2>

      <div className="absolute right-0 top-0 flex items-center gap-2 z-10 mt-8">
        <button className="custom-prev-arrow bg-white text-black rounded-full p-2 shadow-md">
          &#10094;
        </button>
        <button className="custom-next-arrow bg-white text-black rounded-full p-2 shadow-md">
          &#10095;
        </button>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".custom-prev-arrow",
          nextEl: ".custom-next-arrow",
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 12,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 12,
          },
        }}
      >
        {activeProducts.map((product) => (
          <SwiperSlide key={product.productId} className="my-5 max-w-[21rem]">
            <ProductCard
              product={product}
              addToCart={() => addToCart(product)}
              addToWishlist={() => addToWishlist(product)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
