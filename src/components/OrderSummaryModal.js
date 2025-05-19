import React from 'react';
import { FaTimes } from 'react-icons/fa';

const OrderSummaryModal = ({ order, onClose }) => {
  if (!order) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black text-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Order Summary</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-500 hover:text-black" size={20} />
          </button>
        </div>

        {/* Order Details */}
        <div className="space-y-4">
          {order.shippingAddress && (
            <div>
              <span>Shipping Address:</span>
              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.address}, {order.shippingAddress.apartment}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.email}</p>
            </div>
          )}

          <div>
            <span>Items:</span>
            <ul className="space-y-2">
              {order.cartItems && order.cartItems.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.title} (x{item.quantity})</span>
                  <span>{item.sellingPrice} INR</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <span>Total Amount:</span>
            <p>{order.totalAmount} INR</p>
          </div>

          <div className="mt-4">
            <span>Payment Method:</span>
            <p>{order.paymentMethod}</p>
          </div>

          {/* Dispatch Days */}
          {order.dispatchDays && (
            <div className="mt-4">
              <span>Expected Dispatch:</span>
              <p>{order.dispatchDays} days</p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderSummaryModal;
