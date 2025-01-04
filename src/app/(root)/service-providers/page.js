'use client'

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "firebaseConfig"; // Replace with your Firebase config file
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import { setSelectedService } from "@/redux/serviceSlice";
import { useRouter } from "next/navigation";

const ServiceProviders = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedService = useSelector((state) => state.service.selectedService);
  const router = useRouter();
  const userId = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);

        // Fetch all vendor IDs for the selected service
        const servicesRef = collection(db, "services");
        const serviceQuery = query(
          servicesRef,
          where("serviceId", "==", selectedService.serviceId)
        );
        const serviceSnapshot = await getDocs(serviceQuery);

        const vendorIds = serviceSnapshot.docs.map((doc) => doc.data().vendorId);

        if (vendorIds.length === 0) {
          setVendors([]);
          setLoading(false);
          return;
        }

        // Fetch vendor details using the IDs
        const vendorsRef = collection(db, "vendors");
        const vendorQuery = query(vendorsRef, where("__name__", "in", vendorIds)); // "__name__" refers to the document ID
        const vendorSnapshot = await getDocs(vendorQuery);

        const fetchedVendors = vendorSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setVendors(fetchedVendors);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [selectedService.serviceId]);

  const handleBookService = () => {
    if (!userId) {
      toast.error("Please log in to proceed with booking.");
      return;
    }
    dispatch(setSelectedService(selectedService));
    router.push('/book-service');
  }

  if (loading) return <p>Loading vendors...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto font-poppins">
      <h1 className="text-4xl font-bold mb-8 text-center text-red-600">
        {selectedService.serviceName} Providers
      </h1>
      {vendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 transform transition hover:scale-105 hover:shadow-2xl"
            >
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={vendor.documents.photo}
                  alt={vendor.personalDetails.fullName}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {vendor.personalDetails.fullName}
              </h2>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Brand: </span> {vendor.businessDetails.brandName}
              </p>
              <p className="text-gray-500 mb-2">
                <span className="font-semibold">Location: </span>
                {vendor.businessDetails.pickupAddress}
              </p>
              <p className="text-gray-500 mb-4">
                <span className="font-semibold">Phone: </span>
                {vendor.personalDetails.phoneNumber}
              </p>
              <button onClick={handleBookService} className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
                Book Service
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No vendors available for this service.
        </p>
      )}
    </div>
  )
}

export default ServiceProviders