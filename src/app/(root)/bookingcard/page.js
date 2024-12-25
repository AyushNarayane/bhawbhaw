import React from "react";

const BookingCard = () => {
  const booking = {
    service: "PET GROOMING",
    providerName: "JAWS AND PAWS",
    date: "12 OCT, 2024",
    time: "11 AM",
    bookingId: "123456789",
    duration: "2 HOURS",
    image: "/images/common/dummy.png", // Update with the correct image path
  };

  return (
    <div className="flex flex-col bg-white items-center py-10 font-montserrat text-black">
      <p className="text-sm font-semibold">BOOKING ID</p>
      <div className="w-full max-w-4xl p-6 md:p-8 rounded-lg flex flex-col md:flex-row justify-between">
        {/* Left Section */}
        <div className="flex flex-col md:flex-row md:space-x-6">
          <img
            src={booking.image}
            alt={booking.service}
            className="w-52 mb-4 h-auto object-cover rounded"
          />

          <div className="space-y-2 md:space-y-4 md:ml-4">
            <h2 className="text-md font-bold">{booking.service}</h2>
            <p className="text-sm">
              <span className="text-[#676767]">PROVIDER NAME: </span>
              <span className="font-semibold text-black">{booking.providerName}</span>
            </p>
            <p className="text-sm">
              <span className="text-[#676767]">DATE: </span>
              <span className="font-semibold text-black">{booking.date}</span>
            </p>
            <p className="text-sm">
              <span className="text-[#676767]">TIME: </span>
              <span className="font-semibold text-black">{booking.time}</span>
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-start lg:items-end justify-between mt-4 md:mt-0 space-y-2">
          <div className="text-right space-y-1">
            <p className="text-sm font-semibold mb-2 lg:mb-4 text-black">BOOKED</p>
            <p className="text-sm font-semibold text-black">REVIEWS</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#676767]">
              DURATION : <span className="font-bold text-black">{booking.duration}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
