import React from "react";

export const metadata = {
  title: "Bhaw Bhaw | Expert Advice and Tips on Pet Care",
  description: "Explore Bhaw Bhaw's blog for expert tips, advice, and insights on pet care. Stay informed about the latest trends in grooming, training, and health for pets of all kinds, from dogs and cats to birds and fish.",
  keywords: "Bhaw Bhaw blog, pet care tips, pet grooming advice, pet health insights, pet training"
};


const BlogLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default BlogLayout;
