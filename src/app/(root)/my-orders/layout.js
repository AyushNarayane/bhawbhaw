import React from "react";

export const metadata = {
  title: "Track and Manage Your Pet Care Orders",
  description: "Access your Bhaw Bhaw order history and track current bookings. Manage all your orders for pet services and products in one convenient location.",
  keywords: "pet orders, order tracking, order history, pet products"
};

const MyOrdersLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default MyOrdersLayout;
