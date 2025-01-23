'use client'

import React, { useEffect, useState } from 'react';
import PaymentOptions from '@/components/PaymentOptions';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import { ClipLoader } from 'react-spinners';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import OrderSummaryModal from '@/components/OrderSummaryModal';

const PaymentGateway = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { total, deliveryFee } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState();
  const [orderDetails, setOrderDetails] = useState(null); // Store order details
  const params = useSearchParams();
  const orderId = params.get('orderId')

  useEffect(() => {
    setLoading(true);

    const storedUser = JSON.parse(localStorage.getItem('user'));
    dispatch(setUser(storedUser));
    setUserId(storedUser.userId);

    setLoading(false);
  }, [dispatch]);

  const handlePaymentSuccess = async (status) => {
    setIsPaymentSuccessful(status);

    if (isPaymentSuccessful) {
      try {
        // Fetch all product IDs from session storage
        const storedItems = JSON.parse(sessionStorage.getItem('selectedItems')) || [];
        const productIds = storedItems.map(item => item.productId);

        // Remove products from the Firestore cart document
        const cartRef = doc(db, 'cart', userId);
        const cartDoc = await getDoc(cartRef);

        if (cartDoc.exists()) {
          const cartData = cartDoc.data();
          const updatedItems = cartData.items.filter(item => !productIds.includes(item.productId));
          await updateDoc(cartRef, { items: updatedItems });
        }

        // Fetch order details
        const orderRef = doc(db, 'orders', orderId);
        const orderDoc = await getDoc(orderRef);
        if (orderDoc.exists()) {
          setOrderDetails(orderDoc.data());
        }

        // Clear session storage
        sessionStorage.removeItem('selectedItems');

        setShowModal(true);
      } catch (error) {
        console.error('Error while clearing cart:', error);
      }
    }
  };
  console.log(orderDetails);

  const handleModalConfirm = () => {
    setShowModal(false);
    router.push('/my-orders');
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
      />

      {/* Show the modal when payment is successful */}
      {showModal && (
        <OrderSummaryModal order={orderDetails} onClose={handleModalConfirm} />
      )}
    </div>
  );
};

export default PaymentGateway;
