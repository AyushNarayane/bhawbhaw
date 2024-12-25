import React from "react";

export const metadata = {
  title: "Bhaw Bhaw | Personalized Recommendations for Pet Care",
  description: "Discover tailored product and service recommendations for your pets. Bhaw Bhaw's smart recommendation system considers your pet's unique needs and preferences, ensuring you always get the best suggestions for their care and well-being.",
  keywords: "pet care recommendations, suggested products, personalized pet services"
};

const RecommendationLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default RecommendationLayout;
