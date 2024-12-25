import React from "react";

export const metadata = {
  title: "Bhaw Bhaw | Booking Summary",
  description: "Review your pet care bookings in detail with Bhaw Bhaw's Booking Summary page. Get clear insights into scheduled services, provider details, and costs, ensuring you're always prepared for upcoming appointments. Whether it's grooming, training, or health checkups, manage your bookings efficiently and stay on top of your pet's care.",
  keywords: "pet care bookings, booking summary, pet grooming schedule, pet appointments"
};

const BookingCardLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default BookingCardLayout;
