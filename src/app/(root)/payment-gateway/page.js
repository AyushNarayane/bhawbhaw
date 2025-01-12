'use client'

import React, { useEffect, useState } from 'react'
import PaymentOptions from '@/components/PaymentOptions'
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/userSlice';

const PaymentGateway = () => {
  const dispatch = useDispatch();
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false); // Track payment success
  const { total, deliveryFee } = useSelector((state) => state.cart);

  // console.log(total,deliveryFee);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    dispatch(setUser(storedUser))
  }, []);

  const handlePaymentSuccess = (status) => {
    setIsPaymentSuccessful(status);
  };

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