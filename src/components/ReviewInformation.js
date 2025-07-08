"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import PaymentOptions from "./PaymentOptions";
import CouponSection from "./CouponSection";
import Popup from "./Popup";

const ReviewInformation = ({ prevStep, formData = {}, handleSubmit, service }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupVisible1, setIsPopupVisible1] = useState(false);
  const [isPopupVisible2, setIsPopupVisible2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [total, setTotal] = useState(service ? service.sessionCharges : 0);
  const { contactInfo, calendarAndSlot } = formData;
  const userId = useSelector((state) => state.user.userId);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      setIsUserLoggedIn(true); // User is logged in
    }
    fetchCoupons();
  }, []); // Empty dependency array to run only on mount

  const fetchCoupons = async () => {
    try {
      const response = await fetch(`/api/coupons/getAllCoupons`);
      const data = await response.json();

      if (response.ok) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const handleApplyCoupon = async () => {
    if (!coupon) return;

    try {
      setValidatingCoupon(true);
      const response = await fetch(
        `/api/coupons/getCouponsByTitle?couponTitle=${coupon}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setIsPopupVisible1(true);
          setDiscountAmount(0); // Reset discount if coupon not found
        } else {
          setError("Error applying coupon");
          toast.error("Error applying coupon");
        }
        return;
      }

      const { coupons } = await response.json();
      const couponData = coupons[0];

      // Check if coupon is valid for the vendor
      const serviceVendorId = formData?.calendarAndSlot?.vendorId;
      if (!couponData.global && (!couponData.vendorId || couponData.vendorId !== serviceVendorId)) {
        setError("This coupon is not valid for this service");
        toast.error("This coupon is not valid for this service");
        return;
      }

      if (total < couponData.minPrice) {
        setIsPopupVisible2(true);
        return;
      }

      const discount = couponData.discount;
      setDiscountAmount(discount);
      setTotal(total - (total * discount) / 100);
      toast.success("Coupon Applied Successfully!");
    } catch (error) {
      console.error("Error applying coupon:", error);
      setError("An error occurred while applying the coupon.");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handlePaymentSuccess = async (paymentStatus) => {
    if (!paymentStatus) {
      toast.error("Payment failed. Please try again.");
      return;
    }

    setPaymentCompleted(true);
    await handleConfirmSubmit();
  };

  const handleConfirmSubmit = async () => {
    if (!isUserLoggedIn) {
      toast.error("Please log in to book an appointment.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await handleSubmit(); // Handle booking logic here
      setIsPopupVisible(true); // Show success popup
    } catch (error) {
      console.error("Error submitting booking:", error);
      setError("An error occurred while booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = async () => {
    setIsPopupVisible(false); // Close popup immediately
    
    try {
      // Function to send an email via the API route
      const sendMail = async (to, subject, text) => {
        const response = await fetch("/api/sendEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to, subject, text }),
        });
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || "Email sending failed");
        }
      };
  
      const customerEmail = contactInfo.email;
      console.log(customerEmail);
      
      const adminEmail = process.env.NEXT_PUBLIC_GMAIL_USER; // Replace with the actual admin email when available
  
      const customerMessage =
        "Your booking has been successfully processed. Thank you for choosing our service!";
      const adminMessage = `A new booking has been processed. Customer Email: ${contactInfo.email}`;
  
      await Promise.all([
        sendMail(customerEmail, "Your Booking Update", customerMessage),
        sendMail(adminEmail, "New Booking Notification", adminMessage),
      ]);
  
      router.push("/mybookings");
    } catch (error) {
      console.error("Error sending email:", error);
      router.push("/mybookings"); // Still redirect even if email fails
    }
  };
  
  const closePopup1 = () => setIsPopupVisible1(false);
  const closePopup2 = () => setIsPopupVisible2(false);

  // Handle the payment button click
  const handleProceedToPayment = () => {
    if (typeof handleSubmit === 'function') {
      handleSubmit();
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg text-black">
      <Toaster />
      <div className="grid grid-cols-1">
        {/* Review Information */}
        <div className="max-w-2xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Review Your Information
          </h2>
          
          {/* Proceed to Payment Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleProceedToPayment}
              disabled={isLoading}
              className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </button>
            {error && (
              <p className="mt-2 text-red-500 text-sm">{error}</p>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Appointment Information:
          </h3>
          <div className="bg-white shadow-md p-4 rounded-lg mb-4">
            <p className="text-gray-600">
              Date:{" "}
              <span className="font-semibold text-gray-800">
                {calendarAndSlot.selectedDate}
              </span>
            </p>
            <p className="text-gray-600">
              Time Slot:{" "}
              <span className="font-semibold text-gray-800">
                {calendarAndSlot.selectedSlot}
              </span>
            </p>
            <p className="text-gray-600">
              Duration:{" "}
              <span className="font-semibold text-gray-800">
                {calendarAndSlot.duration}
              </span>
            </p>
          </div>
        </div>

        {/* Right Column: Coupons and Payment */}
        <div>
          {isPopupVisible && (
            <Popup
              isOpen={isPopupVisible}
              onClose={closePopup}
              title="Booking Submitted!"
              message="Your booking request has been received. Please complete the payment to confirm your appointment."
              buttonText="OK"
            />
          )}
          {isPopupVisible1 && (
            <Popup
              isOpen={isPopupVisible1}
              onClose={closePopup1}
              title="Invalid Coupon"
              message="The coupon code you entered is not valid. Please check and try again."
              buttonText="OK"
            />
          )}
          {isPopupVisible2 && (
            <Popup
              isOpen={isPopupVisible2}
              onClose={closePopup2}
              title="Minimum Price Not Met"
              message="The total amount is less than the minimum required amount for this coupon."
              buttonText="OK"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewInformation;
