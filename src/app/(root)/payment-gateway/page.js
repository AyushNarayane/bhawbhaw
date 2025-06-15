"use client";

import React, { useEffect, useState } from "react";
import PaymentOptions from "@/components/PaymentOptions";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { ClipLoader } from "react-spinners";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "firebaseConfig";
import OrderSummaryModal from "@/components/OrderSummaryModal";

const PaymentGateway = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { total, deliveryFee } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState();
  const [orderDetails, setOrderDetails] = useState(null); // Store primary order details
  const [allOrders, setAllOrders] = useState([]); // Store all related orders
  const [isMultiVendor, setIsMultiVendor] = useState(false); // Flag for multi-vendor orders
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const transactionId = params.get("transactionId");

  useEffect(() => {
    setLoading(true);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    dispatch(setUser(storedUser));
    setUserId(storedUser.userId);

    setLoading(false);
  }, [dispatch]);

  // Fetch order details when component mounts
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, transactionId]);

  // Fetch all orders and primary order details
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      
      // First, get the primary order
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (orderDoc.exists()) {
        const orderData = orderDoc.data();
        setOrderDetails(orderData);
        
        // Check if this is part of a multi-vendor transaction
        const orderTransactionId = orderData.transactionId || transactionId;
        setIsMultiVendor(orderData.isMultiVendor || false);
        
        // If this is a multi-vendor order and we have a transaction ID, fetch all related orders
        if ((orderData.isMultiVendor || transactionId) && orderTransactionId) {
          const ordersRef = collection(db, "orders");
          const q = query(ordersRef, where("transactionId", "==", orderTransactionId));
          const querySnapshot = await getDocs(q);
          
          const relatedOrders = [];
          querySnapshot.forEach((doc) => {
            relatedOrders.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          setAllOrders(relatedOrders);
          setIsMultiVendor(relatedOrders.length > 1);
        } else {
          // If not multi-vendor, just use the current order
          setAllOrders([{ id: orderId, ...orderData }]);
        }
      } else {
        console.error("Order not found");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (status) => {
    setIsPaymentSuccessful(status);

    if (isPaymentSuccessful) {
      try {
        // Fetch all product IDs from session storage
        const storedItems =
          JSON.parse(sessionStorage.getItem("selectedItems")) || [];
        const productIds = storedItems.map((item) => item.productId);

        // Remove products from the Firestore cart document
        const cartRef = doc(db, "cart", userId);
        const cartDoc = await getDoc(cartRef);

        if (cartDoc.exists()) {
          const cartData = cartDoc.data();
          const updatedItems = cartData.items.filter(
            (item) => !productIds.includes(item.productId)
          );
          await updateDoc(cartRef, { items: updatedItems });
        }
        
        // If not already fetched, fetch all order details
        if (allOrders.length === 0) {
          await fetchOrderDetails();
        }

        // Send order confirmation emails
        try {
          // For each order in allOrders, send emails
          for (const order of allOrders) {
            const emailResponse = await fetch('/api/products/sendOrderEmails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userEmail: order.email,
                vendorEmail: order.storeInfo?.email,
                orderDetails: order
              }),
            });

            if (!emailResponse.ok) {
              console.error('Failed to send order confirmation emails:', await emailResponse.json());
            }
          }
        } catch (error) {
          console.error('Error sending order confirmation emails:', error);
          // Continue with the order even if email sending fails
        }

        // Clear session storage
        sessionStorage.removeItem("selectedItems");

        setShowModal(true);
      } catch (error) {
        console.error("Error while clearing cart:", error);
      }
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    router.push("/my-orders");
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <ClipLoader size={50} color="#000" loading={loading} />
      </div>
    );
  }

  return (
    <div>
      {/* Payment Section */}
      <PaymentOptions
        total={total}
        deliveryFee={deliveryFee}
        onSuccess={handlePaymentSuccess}
        mode="checkout"
        isMultiVendor={isMultiVendor}
        allOrders={allOrders}
      />

      {/* Show the modal when payment is successful */}
      {showModal && (
        <OrderSummaryModal 
          order={orderDetails} 
          allOrders={allOrders}
          isMultiVendor={isMultiVendor}
          onClose={handleModalConfirm} 
        />
      )}
    </div>
  );
};

export default PaymentGateway;
