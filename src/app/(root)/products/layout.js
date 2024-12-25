import React from "react";

export const metadata = {
  title: "Shop the Best Products for Your Pets",
  description: "Browse Bhaw Bhaw's extensive collection of pet care products. From premium food and toys to grooming tools and accessories, find everything you need to keep your pets happy and healthy. Shop now and ensure quality care for your companions.",
  keywords: "pet products, pet supplies, pet grooming, pet food"
};

const ProductsLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default ProductsLayout;
