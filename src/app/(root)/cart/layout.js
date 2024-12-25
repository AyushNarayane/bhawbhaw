import React from "react";

export const metadata = {
  title: "Bhaw Bhaw | Manage Your Pet Care Purchases",
  description: "Review and manage your selected items, adjust quantities, apply discounts, and proceed to checkout seamlessly. Whether you're purchasing pet supplies or booking services, Bhaw Bhaw ensures an effortless shopping experience tailored to your pet's needs.",
  keywords: "pet cart, shopping cart, pet product checkout, pet services"
};

const CartLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default CartLayout;
