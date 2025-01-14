'use client'

import React, { useEffect, useState } from 'react'
import PaymentOptions from '@/components/PaymentOptions'
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import { ClipLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseConfig';

const PaymentGateway = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false); // Track payment success
  const { total, deliveryFee } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState()

  useEffect(() => {
    setLoading(true);

    // Fetch user data
    //also usestate and set user here here from storedUser.userId
    const storedUser = JSON.parse(localStorage.getItem('user'));
    dispatch(setUser(storedUser));
    setUserId(storedUser.userId)

    setLoading(false);
  }, [dispatch]);

  const handlePaymentSuccess = async (status) => {
    setIsPaymentSuccessful(status);

    if (isPaymentSuccessful) {
      const cartRef = doc(db, 'cart', userId)
      await updateDoc(cartRef, { items: [] })
      router.push('/my-orders')
    }
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
      {/* {isPaymentSuccessful && alert('Payment successful')} */}
    </div>
  )
}

export default PaymentGateway;