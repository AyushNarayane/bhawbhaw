'use client'

import React, { useState } from "react";

const PaymentOptions = ({ total, deliveryFee, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState("COD");
  
  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    // Simulate payment processing
    const paymentSuccessful = true;

    if (paymentSuccessful) {
      onSuccess(true); // Trigger success in the parent component
    } else {
      alert("Payment failed!");
      onSuccess(false);
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
                className={`p-4 border rounded-lg cursor-pointer ${selectedMethod === "COD" ? "border-red-500 bg-gray-100" : "border-gray-300"
                  }`}
                onClick={() => setSelectedMethod("COD")}
              >
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={selectedMethod === "COD"}
                    onChange={() => setSelectedMethod("COD")}
                    className="form-radio h-5 w-5 text-red-500"
                  />
                  <span className="ml-4 text-lg font-medium text-gray-700">Cash on Delivery (COD)</span>
                </label>
              </div>

              {/* Credit/Debit Card Option */}
              <div
                className={`p-4 border rounded-lg cursor-pointer ${selectedMethod === "Card" ? "border-red-500 bg-gray-100" : "border-gray-300"
                  }`}
                onClick={() => setSelectedMethod("Card")}
              >
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Card"
                    checked={selectedMethod === "Card"}
                    onChange={() => setSelectedMethod("Card")}
                    className="form-radio h-5 w-5 text-red-500"
                  />
                  <span className="ml-4 text-lg font-medium text-gray-700">Credit/Debit Card</span>
                </label>
              </div>

              {/* Online Banking Option */}
              <div
                className={`p-4 border rounded-lg cursor-pointer ${selectedMethod === "Banking" ? "border-red-500 bg-gray-100" : "border-gray-300"
                  }`}
                onClick={() => setSelectedMethod("Banking")}
              >
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Banking"
                    checked={selectedMethod === "Banking"}
                    onChange={() => setSelectedMethod("Banking")}
                    className="form-radio h-5 w-5 text-red-500"
                  />
                  <span className="ml-4 text-lg font-medium text-gray-700">Online Banking</span>
                </label>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Subtotal:</span>
                <span>₹ {total - deliveryFee}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Delivery Fee:</span>
                <span>₹ {deliveryFee}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>₹ {total}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-lg mt-6 hover:bg-red-600 transition"
            >
              Complete Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentOptions;