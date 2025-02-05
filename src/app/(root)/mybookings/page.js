"use client"; 

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setUser } from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import BookingCard from "@/components/BookingCard";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [userId, setUserId] = useState(null); 
  const router = useRouter();
  const dispatch = useDispatch()

  // Fetch and set userId from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    // console.log(storedUser);

    if (!storedUser?.userId) {
      router.push("/signin"); // Redirect if no userId
      return;
    }

    setUserId(storedUser.userId); // Set the userId
    dispatch(setUser(storedUser))
  }, [router]);

  // Fetch bookings only after userId is set
  useEffect(() => {
    if (!userId) return; // Wait until userId is available

    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/services/getServiceByUserId?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          // console.log("Fetched bookings:", data);
          setBookings(data); // Set the fetched bookings in the state
        } else {
          console.error("Error fetching bookings");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings(); // Fetch bookings
  }, [userId]); // Trigger when userId changes

  // Show a loading state while bookings are being fetched
  if (!bookings) return <p className="font-poppins text-black">Loading...</p>;

  return (
    <div className="flex flex-col items-center py-10 font-poppins">
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