import React from "react";

export const metadata = {
  title: "Bhaw Bhaw Blogs | Stay Updated on Pet Care Trends",
  description: "Explore an extensive collection of insightful blogs on Bhaw Bhaw. Whether you're a new pet owner or a seasoned one, our blogs provide tips, and valuable information about pet care, grooming, training, and health. Stay informed with expert advice and stories to enhance the lives of you and your pets.",
  keywords: "pet blogs, pet tips, animal care stories, grooming articles, pet updates"
};

const BlogsLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default BlogsLayout;
