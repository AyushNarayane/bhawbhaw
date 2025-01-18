"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user.userId); // Assuming `userId` is stored in Redux
  const [isTrackingModalVisible, setIsTrackingModalVisible] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        window.location.href = "/signin"; // Redirect to sign-in if user is not logged in
        return;
      }

      try {
        const response = await fetch(`/api/orders/getOrdersByUserId?userId=${userId}`);
        const data = await response.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return <p className="text-center mt-6">Loading your orders...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 text-black min-h-screen font-poppins">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center mt-4 md:mt-8 text-sm md:text-lg text-gray-500">
          <span>Home</span>
          <Image
            src="/images/services/arrow.png"
            alt="Arrow"
            width={16}
            height={16}
            className="mx-2"
          />
          <span className="text-gray-700 font-medium">My Orders</span>
        </div>

        {/* Header */}
        <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-6 text-gray-800 text-center sm:text-left">
          My Orders
        </h2>

        {orders.length > 0 ? (
          <div className="w-full space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow p-6 rounded-lg"
              >
                {/* Order ID and Status */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-gray-800">Order ID: {order.id}</h3>
                  <p
                    className={`text-sm font-medium ${order.status === 'Delivered'
                      ? 'text-green-600'
                      : order.status === 'Pending'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                      }`}
                  >
                    {order.status}
                  </p>
                </div>

                {/* Shipping Address */}
                <div className="text-sm mb-6">
                  <p className="font-semibold text-gray-700">Shipping Address:</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.apartment}, {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                </div>

                {/* Track Order Button */}
                <div className="text-sm mb-6 flex justify-end items-center">
                  <button
                    onClick={() => {
                      // setTrackingInfo(); // Replace with dynamic info
                      setIsTrackingModalVisible(true);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                  >
                    Track Order
                  </button>
                </div>

                {/* Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:shadow-lg transition-shadow"
                    >
                      {/* Item Image */}
                      <Image
                        src={item.images[0] || "/images/common/dummy.png"}
                        alt={item.title}
                        width={96}
                        height={96}
                        className="object-contain rounded-lg bg-gray-100 mb-4"
                      />
                      {/* Item Details */}
                      <div className="text-center">
                        <h4 className="font-bold text-sm md:text-base text-gray-800">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">Size: {item.size}</p>
                        <p className="font-bold text-lg text-gray-900 mt-2">INR {item.sellingPrice}</p>
                      </div>
                      {/* Quantity */}
                      <div className="mt-4 bg-gray-100 px-4 py-1 rounded-full text-sm font-medium text-gray-700">
                        Qty: {item.quantity || 1}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Amount */}
                <p className="text-right mt-6 font-bold text-xl text-gray-800">
                  Total: INR {order.totalAmount}
                </p>

                {/* Modal for Order Tracking */}
                {isTrackingModalVisible && (
                  <div className="fixed inset-0 flex justify-center items-center bg-black/10 bg-opacity-50 z-10">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                      <h2 className="text-lg font-bold mb-4">Order Tracking</h2>
                      <div className="space-y-4">
                        <p><strong>Tracking Number:</strong> 1234567890</p>
                        <p><strong>Status:</strong> In Transit</p>
                        <p><strong>Estimated Delivery:</strong> January 20, 2025</p>
                        <div className="mt-4">
                          <h4 className="font-semibold">Updates:</h4>
                          <ul className="list-disc pl-5">
                            <li>
                              <span className="font-bold">January 15, 2025:</span> Package dispatched from warehouse
                            </li>
                            <li>
                              <span className="font-bold">January 16, 2025:</span> In transit, expected delivery on January 20, 2025
                            </li>
                            <li>
                              <span className="font-bold">January 17, 2025:</span> Arrived at local distribution center
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => setIsTrackingModalVisible(false)}
                          className="px-4 py-2 bg-gray-300 rounded-xl"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center mt-20 text-gray-600">
            <Image
              src="/images/common/no-orders.png"
              alt="No Orders"
              width={160}
              height={160}
              className="object-contain mb-6"
            />
            <p className="text-lg font-medium">You have no orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
