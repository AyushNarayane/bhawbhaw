'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { db } from 'firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

const ServiceDetailsPage = ({ params }) => {
  const { serviceId } = params;
  const extractedServiceId = serviceId.split('_')[1];

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);

        const serviceDocRef = doc(db, 'services', extractedServiceId);
        const serviceDoc = await getDoc(serviceDocRef);

        if (serviceDoc.exists()) {
          const serviceData = serviceDoc.data();
          setService(serviceData);
        } else {
          console.error('Service not found in Firebase');
        }
      } catch (error) {
        console.error('Error fetching service details from Firebase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [extractedServiceId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen font-poppins">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex justify-center items-center h-screen font-poppins">
        <p className="text-lg font-semibold text-red-600">
          Service not found. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 font-poppins">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-red-700">{service.title}</h1>
        <p className="text-lg text-yellow-600">{service.serviceName}</p>
      </div>

      {/* Image and Details Section */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Section */}
        <div className="flex-shrink-0">
          <div className="relative w-full lg:w-96 h-64 rounded-md overflow-hidden">
            <Image
              src={service.image[0] || '/placeholder.jpg'}
              alt={service.title}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1">
          <p className="text-lg mb-2">
            <span className="font-semibold">Location:</span> {service.address}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">Price:</span> ₹{service.pricePerHour} / hour
          </p>
          <p className="text-lg mb-6">
            <span className="font-semibold">Contact:</span> {service.phoneNumber}
          </p>
          <Link href='/book-service' className="px-6 py-2 bg-red-700 text-white font-semibold rounded-md hover:bg-red-800 transition">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;