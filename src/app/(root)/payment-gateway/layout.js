import React from "react";

export const metadata = {
  title: "Payment - YourShopName",
  description: "Securely complete your payment using Credit/Debit cards, Net Banking, UPI, or Cash on Delivery. Shop with confidence at YourShopName.",
  keywords: ["Payment", "Checkout", "Secure Payment", "Credit Card Payment", "Debit Card Payment", "Net Banking", "UPI", "Cash on Delivery", "YourShopName", "Online Shopping",],
};


const PaymentPageLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default PaymentPageLayout;