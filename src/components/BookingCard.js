import React from 'react';

const BookingCard = ({ booking }) => {
  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg p-6 mb-4 font-montserrat text-black">
      <p className="text-sm font-semibold mb-2">BOOKING ID: {booking.id}</p>
      <div className="w-full flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="flex flex-col md:flex-row md:space-x-6 items-center">
          <img
            src={booking.selectedService.image?.[0] || '/images/common/dummy.png'} // Use the first image from the array, fallback if unavailable
            alt={booking.selectedService.title || 'Service'}
            className="w-40 h-40 object-cover rounded-md"
          />

          <div className="mt-4 md:mt-0 md:ml-4">
            <h2 className="text-md font-bold">{booking.selectedService.title}</h2>
            <p className="text-sm">
              <span className="text-[#676767]">SERVICE NAME: </span>
              <span className="font-semibold text-black">{booking.selectedService.serviceName}</span>
            </p>
            <p className="text-sm">
              <span className="text-[#676767]">ADDRESS: </span>
              <span className="font-semibold text-black">{booking.selectedService.address}</span>
            </p>
            <p className="text-sm">
              <span className="text-[#676767]">PRICE PER HOUR: </span>
              <span className="font-semibold text-black">{`₹${booking.selectedService.pricePerHour}`}</span>
            </p>
            <p className="text-sm">
              <span className="text-[#676767]">STATUS: </span>
              <span
                className={`font-semibold ${
                  booking.status === 'incoming' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {booking.status.toUpperCase()}
              </span>
            </p>
          </div>
        </div>

       {/* Right Section */}
            <div className="ml-auto flex">
            <div className="mt-4 md:mt-0 flex flex-col items-end justify-between">
                <div className="text-right">
                <p className="text-sm text-[#676767]">
                    BOOKED AT: 
                    <span className="font-semibold text-black">{new Date(booking.selectedService.createdAt).toLocaleDateString()}</span>
                </p>
                <p className="text-sm text-[#676767]">
                    CONTACT: 
                    <span className="font-semibold text-black">{booking.selectedService.phoneNumber}</span>
                </p>
                </div>
            </div>
            </div>

      </div>
    </div>
  );
};

export default BookingCard;
