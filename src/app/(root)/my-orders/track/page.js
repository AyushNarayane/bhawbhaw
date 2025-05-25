'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import { ClipLoader } from 'react-spinners';
import DeliveryTracking from '@/components/DeliveryTracking';
import Link from 'next/link';
import Image from 'next/image';

const OrderTrackingPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Order ID is required');
        setLoading(false);
        return;
      }

      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderDoc = await getDoc(orderRef);

        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() });
        } else {
          setError('Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={40} color="#FF5151" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-lg text-red-700">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <Link href="/my-orders" className="mt-4 inline-block text-red-600 hover:underline">
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
          <h2 className="text-lg font-semibold mb-2">Order Not Found</h2>
          <p>We couldn't find the order you're looking for.</p>
          <Link href="/my-orders" className="mt-4 inline-block text-yellow-600 hover:underline">
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  // Check if this is a Borzo delivery
  const isBorzoDelivery = order.deliveryMethod === 'borzo';
  const borzoOrderId = order.borzoDetails?.vendorDetails?.[0]?.orderId || null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/my-orders" className="text-red-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to orders
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1D3178]">Order Tracking</h1>
          <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
            {order.status || 'Processing'}
          </span>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#1D3178] mb-3">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">Order ID</p>
              <p className="font-medium">{order.orderId}</p>
            </div>
            <div>
              <p className="text-gray-500">Order Date</p>
              <p className="font-medium">
                {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Delivery Method</p>
              <p className="font-medium capitalize">
                {isBorzoDelivery ? 'Express Delivery (Borzo)' : 'Standard Delivery'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Total Amount</p>
              <p className="font-medium">₹{order.totalAmount}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#1D3178] mb-3">Shipping Address</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.address}</p>
            {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#1D3178] mb-3">Order Items</h2>
          <div className="space-y-4">
            {order.cartItems.map((item, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                {item.images && item.images.length > 0 && (
                  <div className="mr-4">
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <div className="flex justify-between mt-2">
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="font-medium">₹{item.sellingPrice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <DeliveryTracking 
            orderId={order.orderId} 
            borzoOrderId={borzoOrderId}
            order={order}
          />
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Subtotal</span>
            <span>₹{order.totalAmount - order.deliveryFee}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Shipping Fee</span>
            <span>₹{order.deliveryFee}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage; 