"use client"
import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useSelector } from 'react-redux';

const ReviewInformation = ({
  prevStep,
  formData = {},
  handleSubmit
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const data = useSelector(state=> state.service )
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); 
  const { contactInfo, calendarAndSlot } = formData;
  const userId = useSelector(state => state.user.userId)

  useEffect(() => {
    if (userId) {
      setIsUserLoggedIn(true); // User is logged in
    } 
  }, []); // Empty dependency array to run only on mount

  const handleConfirmSubmit = async () => {

    setIsLoading(true);
    setError(null);

    try {
      setIsPopupVisible(true);
      await handleSubmit()
    } catch (error) {
      console.error('Error submitting booking:', error);
      setError('An error occurred while booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg text-black">
      
          <h2 className="text-lg font-bold mb-4">Review Your Information</h2>
          <h3 className="text-md font-semibold">Contact Information:</h3>
          <p>Full Name: {contactInfo.fullName}</p>
          <p>Email: {contactInfo.email}</p>
          <p>Address: {contactInfo.address}</p>
          <p>Phone Number: {contactInfo.phoneNumber}</p>
          <p>Preferred Contact Method: {contactInfo.contactMethod}</p>

          <h3 className="text-md font-semibold mt-4">Appointment Information:</h3>
          <p>Date: {calendarAndSlot.date}</p>
          <p>Time Slot: {calendarAndSlot.timeSlot}</p>
          <p>Duration: {calendarAndSlot.duration}</p>

          <div className="flex justify-between mt-4">
            <button
              className="border border-pink-500 text-pink-500 px-4 py-2 rounded"
              onClick={prevStep}
            >
              Edit
            </button>
            <button
              className="bg-pink-500 text-white px-4 py-2 rounded"
              onClick={handleConfirmSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Confirm and Submit'}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          {isPopupVisible && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center" aria-modal="true" role="dialog">
              <div className="bg-white p-8 rounded-lg shadow-lg relative">
                <button
                  className="absolute top-2 right-2"
                  onClick={closePopup}
                  aria-label="Close popup"
                >
                  <img
                    src="/images/services/cross.png"
                    alt="Close"
                    className="w-4 h-4 m-1"
                  />
                </button>
                <div className="flex flex-col mx-32 my-3 items-center">
                  <img
                    src="/images/services/popup.png"
                    alt="Success Icon"
                    className="w-32 h-32 mb-7"
                  />
                  <p className="text-lg font-semibold mb-2">Your booking was successful!</p>
                  <Link href="/mybookings" className="bg-[#F33877] text-white px-8 py-2 rounded mt-4">
                    View Bookings
                  </Link>
                </div>
              </div>
            </div>
          )}
          </div>
        
     
  );
};

export default ReviewInformation;
