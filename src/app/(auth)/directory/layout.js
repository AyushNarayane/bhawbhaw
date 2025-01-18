import React from "react";

export const metadata = {
  title: "Directory - Explore Our Listings",
  description: "Browse through our comprehensive directory to find the resources, services, or information you need. Simplify your search with our curated listings.",
  keywords: "directory, listings, resources, services, information, explore"
};

const DirectoryLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default DirectoryLayout;
