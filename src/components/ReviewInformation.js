"use client";

import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { useSelector } from 'react-redux';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import PaymentOptions from './PaymentOptions';

const ReviewInformation = ({
  prevStep,
  formData = {},
  handleSubmit
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const { contactInfo, calendarAndSlot } = formData;
  const userId = useSelector(state => state.user.userId);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      setIsUserLoggedIn(true); // User is logged in
    }
  }, []); // Empty dependency array to run only on mount

  const handlePaymentSuccess = async (paymentStatus) => {
    if (!paymentStatus) {
      toast.error('Payment failed. Please try again.');
      return;
    }

    setPaymentCompleted(true);
    await handleConfirmSubmit();
  };

  const handleConfirmSubmit = async () => {
    if (!isUserLoggedIn) {
      toast.error('Please log in to book an appointment.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await handleSubmit(); // Handle booking logic here
      setIsPopupVisible(true); // Show success popup
    } catch (error) {
      console.error('Error submitting booking:', error);
      setError('An error occurred while booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    router.push('/mybookings'); // Redirect to bookings page
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg text-black">
      <Toaster />
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Review Your Information</h2>

      <h3 className="text-lg font-semibold text-gray-700 mb-2">Contact Information:</h3>
      <div className="bg-white shadow-md p-4 rounded-lg mb-4">
        <p className="text-gray-600">Full Name: <span className="font-semibold text-gray-800">{contactInfo.fullName}</span></p>
        <p className="text-gray-600">Email: <span className="font-semibold text-gray-800">{contactInfo.email}</span></p>
        <p className="text-gray-600">Address: <span className="font-semibold text-gray-800">{contactInfo.address}</span></p>
        <p className="text-gray-600">Phone Number: <span className="font-semibold text-gray-800">{contactInfo.phoneNumber}</span></p>
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mb-2">Appointment Information:</h3>
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <p className="text-gray-600">Date: <span className="font-semibold text-gray-800">{calendarAndSlot.date}</span></p>
        <p className="text-gray-600">Time Slot: <span className="font-semibold text-gray-800">{calendarAndSlot.timeSlot}</span></p>
        <p className="text-gray-600">Duration: <span className="font-semibold text-gray-800">{calendarAndSlot.duration}</span></p>
      </div>

      <div className="flex justify-between mt-6">
        <button
          className="bg-pink-500 text-white px-6 py-3 rounded-lg shadow-md transform transition-all duration-300 hover:bg-pink-600 hover:scale-105"
          onClick={prevStep}
        >
          Edit
        </button>
      </div>

      {/* Payment Options Component */}
      {!paymentCompleted && (
        <PaymentOptions
          total={1000}
          onSuccess={handlePaymentSuccess}
          mode='service'
        />
      )}

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      {/* Success Popup TODO REPLACE THIS WOTH POPUP */}
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
              <button
                onClick={closePopup}
                className="bg-[#F33877] text-white px-8 py-2 rounded mt-4"
              >
                View Bookings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewInformation;
