import React from "react";

export const metadata = {
  title: "Manage Saved Addresses for Easy Bookings",
  description: "Save and manage multiple delivery addresses for a faster and more efficient checkout experience. Update your details as needed to ensure smooth delivery of products and services for your pets.",
  keywords: "saved addresses, delivery address, manage addresses"
};

const SavedAddressesLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default SavedAddressesLayout;
