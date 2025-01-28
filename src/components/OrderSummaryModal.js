import React from 'react';
import { FaTimes } from 'react-icons/fa';

const OrderSummaryModal = ({ order, onClose }) => {
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
          <div>
            <span>Shipping Address:</span>
            <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
            <p>{order.shippingAddress.address}, {order.shippingAddress.apartment}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.email}</p>
          </div>

          <div>
            <span>Items:</span>
            <ul className="space-y-2">
              {order.items.map((item, index) => (
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
          <div className="mt-4">
            <span>Expected Dispatch:</span>
            <p>{order.dispatchDays} days</p>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryModal;
