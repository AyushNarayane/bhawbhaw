import React from "react";

export const metadata = {
  title: "Search Results - Your Site",
  description: "Find the best products that match your search query.",
  keywords: "search, products, ecommerce",
};

const SearchLayout = ({ children }) => {
  return (
    <div className="search-layout p-4">
      <h1 className="text-center text-3xl font-bold mt-4">Search Results</h1>
      <div className="search-content">{children}</div>
    </div>
  );
};

export default SearchLayout;
