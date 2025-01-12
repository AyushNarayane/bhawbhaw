import Image from "next/image";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseConfig";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const BookingCard = ({ booking }) => {
  const [bookingStatus, setBookingStatus] = useState(booking.status);

  const isTimeSlotPassed = () => {
    const currentDate = new Date();
    const bookingDate = new Date(booking.calendarAndSlot.date);
    const [startTime] = booking.calendarAndSlot.timeSlot.split(" - ");
    const bookingTime = new Date(`${booking.calendarAndSlot.date} ${startTime}`);

    return currentDate > bookingTime; // True if current time is after the booking time
  };

  const markAsCompleted = async () => {
    if (!isTimeSlotPassed()) {
      toast.error("You can only mark this as completed after the time slot.");
      return;
    }

    try {
      const bookingRef = doc(db, "bookings", booking.id);
      await updateDoc(bookingRef, { status: "completed" });
      setBookingStatus("completed");
      toast.success("Booking marked as completed!");
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status.");
    }
  };

  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg p-6 mb-4 font-montserrat text-black">
      <Toaster />
      <p className="text-sm font-semibold mb-2">BOOKING ID: {booking.bookingID}</p>
      <div className="w-full flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="flex flex-col md:flex-row md:space-x-6 items-center">
          <Image
            width={500}
            height={500}
            src={booking.selectedService?.image?.[0] || '/images/common/dummy.png'}
            alt={booking.selectedService?.title || 'Service'}
            className="w-40 h-40 object-cover rounded-md"
          />

          <div className="mt-4 md:mt-0 md:ml-4">
            <h2 className="text-md font-bold">{booking.selectedService?.title}</h2>
            <p className="text-sm">
              <span className="text-[#676767]">SERVICE NAME: </span>
              <span className="font-semibold text-black">
                {booking.selectedService?.serviceName}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-[#676767]">ADDRESS: </span>
              <span className="font-semibold text-black">
                {booking.selectedService?.address}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-[#676767]">PRICE PER HOUR: </span>
              <span className="font-semibold text-black">
                ₹{booking.selectedService?.pricePerHour || 'N/A'}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-[#676767]">STATUS: </span>
              <span className={`font-semibold ${bookingStatus === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                {bookingStatus.toUpperCase()}
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
                <span className="font-semibold text-black">
                  {' '}{new Date(booking.selectedService?.createdAt).toLocaleDateString()}
                </span>
              </p>
              <p className="text-sm text-[#676767]">
                CONTACT:
                <span className="font-semibold text-black">
                  {' '}{booking.contactInfo?.phoneNumber || 'N/A'}
                </span>
              </p>
            </div>
            {bookingStatus === "incoming" && (
              <button
                onClick={markAsCompleted}
                className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-600"
              >
                Mark as Completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;