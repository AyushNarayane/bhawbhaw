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
          src={service.image[0] || "/placeholder.jpg"} // First image or placeholder
          alt={service.title || "Service Image"}
          layout="fill"
          objectFit="cover"
          className="rounded-t-md"
          priority={true} // Optimize loading for visible cards
        />
      </div>

      {/* Service details */}
      <div className="mt-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">
          {service.title}
        </h3>
        <p className="text-sm text-gray-500">{service.serviceName}</p>
        <p className="text-sm text-gray-500 truncate">{service.address}</p>
        <p className="text-md font-semibold text-gray-800 mt-2">
          ₹{service.pricePerHour} / hour
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
