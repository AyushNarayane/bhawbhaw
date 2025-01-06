'use client'

import Hero from "@/components/Hero";
import OfferCards from "@/components/OfferCards";
import PetSearchSection from "@/components/PetSearchSection";
import ProductCarousel from "@/components/ProductCarousel";
import ProtectedHomeRoute from "@/components/ProtectedHomeRoute";
import Protected from "@/components/ProtectedRoute";
import Services from "@/components/Services";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    if (!sessionStorage.getItem("reloadDone")) {
      sessionStorage.setItem("reloadDone", "true"); // Prevent further reloads
      location.reload(); // Reload the page once if no user is found
    }
  }, [])

  return (
    <div>
      <Hero />
      <Services />
      <ProductCarousel />
      <OfferCards />
      {/* <PetSearchSection /> */}
    </div>
  );
};

export default ProtectedHomeRoute(Home);