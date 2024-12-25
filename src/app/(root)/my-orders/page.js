"use client"; // Ensures client-side rendering

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user.userId); // Assuming `userId` is stored in Redux

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
    
    <div className="p-6 bg-white text-black min-h-screen font-montserrat">
        <div className="flex items-center mt-4 md:mt-8">
    <span className="text-sm md:text-lg text-[#676767]">Home</span>
    <img src="images/services/arrow.png" alt="Arrow" className="mx-2 w-3 h-3 md:w-4 md:h-4" />
    <span className="text-sm md:text-lg">My Orders</span>
  </div>
  <h2 className="text-2xl pt-1 md:text-3xl font-semibold mb-4">My Orders</h2>
      {orders.length > 0 ? (
        <div className="w-full max-w-4xl space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-300 bg-white p-4 rounded-lg">
              {/* Order ID and Status */}
              <h3 className="font-bold text-lg mb-2">Order ID: {order.id}</h3>
              <p className="text-sm text-gray-500 mb-4">Status: {order.status}</p>

              {/* Shipping Address */}
              <div className="text-sm mb-4">
                <p className="font-semibold">Shipping Address:</p>
                <p>
                  {order.shippingAddress.apartment}, {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.postalCode}
                </p>
              </div>

              {/* Items in the Order */}
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-300 bg-white p-4 rounded-lg flex items-center justify-between flex-col sm:flex-row"
                  >
                    <div className="flex items-center mb-4 sm:mb-0">
                      {/* Item Image */}
                      <img
                        src={item.images[0] || "/images/common/dummy.png"}
                        alt={item.title}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg bg-[#f0eeed]"
                      />
                      {/* Item Details */}
                      <div className="ml-4">
                        <h3 className="font-bold text-base md:text-lg">{item.title}</h3>
                        <p className="text-xs md:text-sm my-1">
                          Size: <span className="text-[#676767]">{item.size}</span>
                        </p>
                        <p className="font-bold text-lg">INR {item.sellingPrice}</p>
                      </div>
                    </div>

                    {/* Item Quantity */}
                    <div className="flex lg:flex-col sm:flex-row-reverse items-center lg:items-end w-full lg:w-auto justify-between">
                      <div className="flex items-center mt-12 bg-[#F0F0F0] px-2 py-1 rounded-2xl">
                        <span className="mx-2">{item.quantity || 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount */}
              <p className="text-right mt-4 font-bold text-lg">Total: INR {order.totalAmount + 15}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">You have no orders yet.</p>
      )}
    </div>
  );
};

export default MyOrders;
