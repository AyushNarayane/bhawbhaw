'use client'

import React, { useState, useEffect } from "react";
import { FaSpinner } from 'react-icons/fa';

// Custom hook to load the Razorpay script
const useRazorpayScript = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
};

const PaymentOptions = ({ 
  total, 
  deliveryFee = 0, 
  onSuccess, 
  mode = 'checkout', 
  serviceName, 
  customerName, 
  customerEmail, 
  customerContact,
  previewMode = false // New prop to control preview/processing mode
}) => {
  useRazorpayScript(); // Load the script
  const [selectedMethod, setSelectedMethod] = useState("COD");
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (previewMode) {
      // In preview mode, just pass the selected method and let parent handle the next step
      onSuccess({ 
        paymentMethod: selectedMethod,
        preview: true
      });
      return;
    }
    
    setIsLoading(true);

    if (selectedMethod === "COD") {
      // For Cash on Delivery, call success with payment method
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        onSuccess({ 
          paymentMethod: 'COD',
          paymentStatus: 'pending',
          paymentId: `COD_${Date.now()}`
        });
      } catch (error) {
        console.error('Error processing COD:', error);
        onSuccess(null);
      } finally {
        setIsLoading(false);
      }
    } else if (selectedMethod === "Online") {
      // For Online Payment, start the Razorpay flow
      try {
        // 1. Create an order from your backend
        const response = await fetch('/api/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total }),
        });

        if (!response.ok) throw new Error('Failed to create Razorpay order');
        const order = await response.json();

        // 2. Configure and open Razorpay Checkout
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "BhawBhaw Pet Services",
          description: `Payment for ${serviceName}`,
          order_id: order.id,
          handler: function (response) {
            // 3. On successful payment, call the onSuccess callback with payment details
            onSuccess({
              paymentMethod: 'Online',
              paymentStatus: 'completed',
              razorpayPaymentId: response.razorpay_payment_id,
              paymentId: response.razorpay_order_id || `rzp_${Date.now()}`
            });
          },
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerContact,
          },
          theme: { color: "#F37254" },
          modal: {
            ondismiss: function () {
              setIsLoading(false); // Re-enable button if user closes modal
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

        rzp.on('payment.failed', function (response) {
            console.error('Payment failed:', response.error);
            onSuccess({
              paymentMethod: 'Online',
              paymentStatus: 'failed',
              error: response.error.description,
              paymentId: response.error.metadata ? response.error.metadata.order_id : `failed_${Date.now()}`
            });
        });

      } catch (error) {
        console.error('Payment initiation failed:', error);
        onSuccess({
          paymentMethod: 'Online',
          paymentStatus: 'failed',
          error: error.message,
          paymentId: `error_${Date.now()}`
        });
      }
    }
  };

  return (
    <div className="font-poppins py-10 text-black bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-center text-[#15245E] mb-8">Payment Options</h1>
        <form onSubmit={handlePaymentSubmit}>
          <div className="bg-[#fdfafa] rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#1D3178]">Select Payment Method</h2>
            <div className="space-y-4">
              {/* COD Option */}
              <div
                className={`p-4 border rounded-lg cursor-pointer ${selectedMethod === "COD" ? "border-red-500 bg-gray-100" : "border-gray-300"}`}
                onClick={() => setSelectedMethod("COD")}
              >
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="paymentMethod" value="COD" checked={selectedMethod === "COD"} onChange={() => {}} className="form-radio h-5 w-5 text-red-500"/>
                  <span className="ml-4 text-lg font-medium text-gray-700">Cash on Delivery (COD)</span>
                </label>
              </div>

              {/* Online Payment Option */}
              <div
                className={`p-4 border rounded-lg cursor-pointer ${selectedMethod === "Online" ? "border-red-500 bg-gray-100" : "border-gray-300"}`}
                onClick={() => setSelectedMethod("Online")}
              >
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="paymentMethod" value="Online" checked={selectedMethod === "Online"} onChange={() => {}} className="form-radio h-5 w-5 text-red-500"/>
                  <span className="ml-4 text-lg font-medium text-gray-700">Pay Online (Card, UPI, QR Code)</span>
                </label>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>₹ {total}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-red-500 text-white py-3 rounded-lg mt-6 hover:bg-red-600 transition-all duration-200 flex items-center justify-center space-x-2 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin h-5 w-5" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{previewMode ? 'Proceed to Payment' : 'Complete Payment'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentOptions;