import React from "react";
import Image from "next/image";

const ServiceCard = ({ service, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg cursor-pointer w-64 flex-shrink-0"
    >
      {/* Service image */}
      <div className="relative h-40 w-full rounded-md overflow-hidden">
        <Image
          src='/placeholder.webp' 
          alt={service.title || "Service Image"}
          layout="fill"
          objectFit="cover"
          className="rounded-t-md"
          priority={true}
        />
      </div>

      {/* Service details */}
      <div className="mt-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">
          {service.title}
        </h3>
        <p className="text-lg text-black">{service.serviceType}</p>
        <p className="text-base text-gray-500">{service.specialization}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
