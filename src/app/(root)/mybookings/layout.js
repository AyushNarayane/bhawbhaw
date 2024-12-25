import React from "react";

export const metadata = {
  title: "View and Manage Your Pet Service Bookings",
  description: "Stay updated on your pet care appointments with Bhaw Bhaw's My Bookings page. Manage your upcoming and past bookings, review service details, and make changes to ensure your pet always gets the best care when they need it.",
  keywords: "pet care bookings, appointment tracking, pet service management"
};

const MyBookingsLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default MyBookingsLayout;
