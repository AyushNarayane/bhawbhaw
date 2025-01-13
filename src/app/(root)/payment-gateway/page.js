'use client'

import React, { useEffect, useState } from 'react'
import PaymentOptions from '@/components/PaymentOptions'
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import { ClipLoader } from 'react-spinners';

const PaymentGateway = () => {
  const dispatch = useDispatch();
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false); // Track payment success
  const { total, deliveryFee } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);

    // Fetch user data
    const storedUser = JSON.parse(localStorage.getItem('user'));
    dispatch(setUser(storedUser));

    setLoading(false);
  }, [dispatch]);

  const handlePaymentSuccess = (status) => {
    setIsPaymentSuccessful(status);
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
      {isPaymentSuccessful && alert('Payment successful')}
    </div>
  )
}

export default PaymentGateway;