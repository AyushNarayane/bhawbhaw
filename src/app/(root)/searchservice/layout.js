import React from "react";

export const metadata = {
  title: "Bhaw Bhaw | Find the Best Pet Services Near You",
  description: "Find the perfect pet care service quickly and easily on Bhaw Bhaw. Search for grooming, training, health checkups, and more, tailored to your pet's needs. Start your search and connect with trusted professionals today.",
  keywords: "search pet services, find pet care, grooming search"
};

const SearchServiceLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default SearchServiceLayout;
