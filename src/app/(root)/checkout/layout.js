import React from "react";

export const metadata = {
  title: "Bhaw Bhaw | Secure Checkout for Pet Care Services",
  description: "Complete your bookings and purchases securely on Bhaw Bhaw. Review your order, apply any available discounts, and choose your preferred payment method. We prioritize safe transactions, ensuring a hassle-free purchase experience for both pet products and services.",
  keywords: "checkout page, secure payment, pet care purchase, pet product checkout"
};

const CheckoutLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default CheckoutLayout;
