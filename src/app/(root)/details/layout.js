import React from "react";

export const metadata = {
  title: "Explore Pet Products Tailored for Your Pets",
  description: "Discover detailed information about our pet care products, including specifications, usage instructions, and benefits. From nutritious pet food to grooming essentials, explore everything you need to make informed decisions and give your pets the care they deserve.",
  keywords: "pet product details, pet product features, pet supplies"
};

const ProductDetailsLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default ProductDetailsLayout;
