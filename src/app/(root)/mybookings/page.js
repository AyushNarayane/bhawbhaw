"use client";  // Ensures this component runs on the client side

import React, { useEffect, useState } from 'react';
import BookingCard from '../../../components/BookingCard'; // Assuming BookingCard is in the components folder
import { useSelector } from 'react-redux';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const userId = useSelector((state) => state.user.userId); // Assuming userId is stored in Redux

  // Fetch bookings when component mounts and when userId changes
  useEffect(() => {
    if (!userId) {
      // If there's no userId, redirect to sign-in page using window.location
      window.location.href = '/signin'; // Redirect to sign-in page
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/services/getServiceByUserId?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setBookings(data); // Set the fetched bookings in the state
        } else {
          console.error('Error fetching bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings(); // Fetch bookings if userId exists
  }, [userId]); // Only rerun the effect when userId changes

  return (
    <div className="flex flex-col items-center py-10">
      <h2 className="text-2xl font-semibold mb-6 text-black">My Bookings</h2>
      
      {bookings.length > 0 ? (
        <div className="w-full max-w-6xl space-y-8">
          {/* Map through the bookings and display each one in a vertical stack */}
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-600">You have no bookings yet.</p>
      )}
    </div>
  );
};

export default MyBookings;
