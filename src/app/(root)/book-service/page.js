"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { db } from 'firebaseConfig';
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast';

import ContactInformation from '@/components/ContactInformation';
import CalendarAndSlot from '@/components/CalenderAndSlots';
import ReviewInformation from '@/components/ReviewInformation';
import PaymentOptions from '@/components/PaymentOptions';
import { clearUser } from '@/redux/userSlice';
import { setContactInfo, setCalendarAndSlot } from '@/redux/serviceSlice';

const MultiStepForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const selectedService = useSelector((state) => state.service.selectedService);

  const [step, setStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState([]);
  const [formData, setFormData] = useState({
    contactInfo: {},
    calendarAndSlot: {},
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentProcessing, setShowPaymentProcessing] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      router.push('/');
      dispatch(clearUser());
    } else {
      setUserId(user.userId);
    }
  }, [dispatch, router]);

  useEffect(() => {
    if (!userId) return;

    const fetchSavedAddresses = async () => {
      try {
        const addressRef = doc(db, 'users', userId);
        const userDoc = await getDoc(addressRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setSavedAddresses(data.addresses || []);
        }
      } catch (error) {
        console.error("Error fetching saved addresses:", error);
      }
    };

    fetchSavedAddresses();
  }, [userId]);

  const nextStep = () => {
    if (!visitedSteps.includes(step)) {
      setVisitedSteps([...visitedSteps, step]);
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleFormDataChange = (section, data) => {
    setFormData(prev => ({ ...prev, [section]: data }));
    if (section === 'contactInfo') {
      dispatch(setContactInfo(data));
    } else if (section === 'calendarAndSlot') {
      dispatch(setCalendarAndSlot({
        selectedDate: data.selectedDate,
        selectedSlot: data.selectedSlot,
        duration: data.duration
      }));
    }
  };

  const validateBookingData = () => {
    console.log('Validating form data:', JSON.stringify(formData, null, 2));
    
    // Check if contactInfo exists and has all required fields
    if (!formData.contactInfo) {
      console.error('contactInfo is missing');
      toast.error("Please fill in all contact information.");
      return false;
    }
    
    // Check each required field individually for better error messages
    const requiredFields = ['fullName', 'email', 'phoneNumber', 'address'];
    const fieldDisplayNames = {
      fullName: 'Full Name',
      email: 'Email',
      phoneNumber: 'Phone Number',
      address: 'Address'
    };
    
    const missingFields = requiredFields.filter(field => !formData.contactInfo[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      const displayNames = missingFields.map(field => fieldDisplayNames[field] || field);
      toast.error(`Please fill in: ${displayNames.join(', ')}`);
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contactInfo.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    
    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.contactInfo.phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return false;
    }
    
    if (!formData.calendarAndSlot || !formData.calendarAndSlot.selectedDate || !formData.calendarAndSlot.selectedSlot) {
      toast.error("Please select a date and time slot.");
      return false;
    }
    
    if (!selectedService || !selectedService.vendorId) {
      toast.error("Service information is incomplete. Please try again.");
      return false;
    }
    
    return true;
  };

  const handleProceedToPayment = async () => {
    if (!validateBookingData()) {
      return;
    }
    
    // Verify vendor exists before showing payment options
    try {
      const vendorRef = doc(db, 'vendors', selectedService.vendorId);
      const vendorDoc = await getDoc(vendorRef);
      if (!vendorDoc.exists()) {
        toast.error("Vendor not found. Please try another service.");
        return;
      }
      
      // Reset payment states
      setSelectedPaymentMethod(null);
      setShowPaymentProcessing(false);
      setShowPaymentOptions(true);
    } catch (error) {
      console.error("Error verifying vendor:", error);
      toast.error("Error verifying service availability. Please try again.");
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    console.log('Payment data received:', paymentData);
    setShowPaymentOptions(false);
    
    if (!paymentData) {
      toast.error("Payment failed or was cancelled.");
      return;
    }

    // Check if payment failed
    if (paymentData.paymentStatus === 'failed') {
      toast.error(paymentData.error || "Payment failed. Please try again.");
      return;
    }
    
    // Final validation before processing the booking
    if (!validateBookingData()) {
      console.error('Validation failed in handlePaymentSuccess');
      return;
    }

    // Prepare booking data with proper structure
    const bookingData = {
      userId: userId,
      vendorId: selectedService?.vendorId,
      serviceId: selectedService?.id,
      serviceName: selectedService?.name,
      customerName: formData.contactInfo.fullName,
      customerEmail: formData.contactInfo.email,
      customerPhone: formData.contactInfo.phoneNumber,
      customerAddress: formData.contactInfo.address,
      bookingDate: formData.calendarAndSlot.selectedDate,
      bookingTime: formData.calendarAndSlot.selectedSlot,
      duration: formData.calendarAndSlot.duration,
      status: 'confirmed',
      paymentStatus: paymentData.paymentStatus === 'completed' ? 'completed' : 'pending',
      paymentMethod: paymentData.paymentMethod,
      paymentId: paymentData.paymentId,
      razorpayPaymentId: paymentData.razorpayPaymentId || null,
      amount: selectedService.sessionCharges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Creating booking with data:', bookingData);

    try {
      // Check if vendor exists
      const vendorRef = doc(db, 'vendors', selectedService.vendorId);
      const vendorDoc = await getDoc(vendorRef);
      
      if (!vendorDoc.exists()) {
        throw new Error('Vendor not found');
      }
      
      const vendorData = vendorDoc.data();
      console.log('Vendor data:', vendorData);
      
      // Access email from personalDetails object
      const vendorEmail = vendorData.personalDetails?.email;
      
      if (!vendorEmail) {
        console.error('Vendor email is missing in vendor data');
        console.error('Vendor data structure:', JSON.stringify(vendorData, null, 2));
        throw new Error('Vendor email not found in personal details');
      }

      // Prepare booking data with required fields
      const bookingData = {
        userId,
        contactInfo: formData.contactInfo || {},
        calendarAndSlot: {
          date: formData.calendarAndSlot?.selectedDate || new Date().toISOString(),
          slot: formData.calendarAndSlot?.selectedSlot || 'Not specified',
        },
        serviceId: selectedService?.id || 'unknown',
        serviceName: selectedService?.name || 'Unknown Service',
        servicePrice: selectedService?.sessionCharges || 0,
        vendorId: selectedService?.vendorId || 'unknown',
        status: 'pending',
        createdAt: new Date(),
        paymentDetails: paymentData || {},
      };

      // Validate required fields
      const requiredFields = [
        'userId',
        'serviceId',
        'serviceName',
        'vendorId',
        'contactInfo.fullName',
        'contactInfo.email',
        'contactInfo.phoneNumber',
        'contactInfo.address'
      ];

      const missingFields = [];
      requiredFields.forEach(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], bookingData);
        if (value === undefined || value === null || value === '') {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        console.error('Missing required booking fields:', missingFields);
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      console.log('Creating booking with data:', bookingData);

      // Create booking in Firestore
      const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
      console.log('Booking created with ID:', bookingRef.id);

      // Show success message based on payment method
      if (paymentData.paymentMethod === 'COD') {
        toast.success('Booking confirmed! Please pay in cash when the service is completed.');
      } else {
        toast.success('Booking and payment confirmed!');
      }

      // Redirect to booking confirmation page with the booking ID
      router.push(`/my-bookings`);

      // Send email to customer and vendor
      const emailData = {
        to: formData.contactInfo.email,
        vendorEmail: vendorEmail,
        subject: 'Booking Confirmation',
        name: formData.contactInfo.name,
        service: selectedService.name,
        date: formData.calendarAndSlot.selectedDate,
        slot: formData.calendarAndSlot.selectedSlot,
        bookingId: bookingRef.id,
      };

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });

      router.push('/mybookings');
    } catch (error) {
      console.error("Failed to finalize booking:", error);
      let errorMessage = "There was an error confirming your booking.";
      
      if (error.message.includes('Missing required fields')) {
        errorMessage = "Please fill in all required information before booking.";
      } else if (error.message.includes('Vendor email not found')) {
        errorMessage = "Could not find vendor contact information. Please try another service.";
      }
      
      toast.error(errorMessage);
      setShowPaymentOptions(false);
    }
  };

  const getStepStyle = (currentStep) => {
    if (visitedSteps.includes(currentStep)) {
      return {
        icon: '/images/services/tick.png',
        borderColor: 'border-black',
        textColor: 'text-black',
      };
    } else if (step === currentStep) {
      return {
        icon: '/images/services/downArrow.png',
        borderColor: 'border-black',
        textColor: 'text-black',
      };
    } else {
      return {
        icon: '/images/services/arrow.png',
        borderColor: 'border-gray-400',
        textColor: 'text-gray-400',
      };
    }
  };

  const renderFormSteps = () => {
    switch (step) {
      case 1:
        return <ContactInformation nextStep={nextStep} handleFormDataChange={(data) => handleFormDataChange('contactInfo', data)} formData={formData.contactInfo} savedAddresses={savedAddresses} />;
      case 2:
        return <CalendarAndSlot nextStep={nextStep} prevStep={prevStep} handleFormDataChange={(data) => handleFormDataChange('calendarAndSlot', data)} formData={formData.calendarAndSlot} />;
      case 3:
        return <ReviewInformation prevStep={prevStep} formData={formData} handleSubmit={handleProceedToPayment} service={selectedService} />;
      default:
        return null;
    }
  };

  if (!selectedService) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center font-poppins">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">No service selected.</h2>
                <button onClick={() => router.push('/')} className="bg-red-500 text-white py-2 px-4 rounded-lg">Go to Homepage</button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-poppins">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full mx-4 my-8">
        <Toaster position="top-center" />
        {showPaymentOptions ? (
          <PaymentOptions
            total={selectedService?.sessionCharges || 0}
            onSuccess={(data) => {
              if (data.preview) {
                // In preview mode, just store the selected method
                setSelectedPaymentMethod(data.paymentMethod);
                
                if (data.paymentMethod === 'Online') {
                  // If online payment is selected, trigger payment immediately
                  setShowPaymentProcessing(true);
                  return; // The actual payment will be handled in the next render
                } else {
                  // For COD, proceed with booking
                  handlePaymentSuccess({
                    paymentMethod: 'COD',
                    paymentStatus: 'pending',
                    paymentId: `COD_${Date.now()}`
                  });
                }
              } else {
                // In processing mode, handle the actual payment result
                handlePaymentSuccess(data);
              }
            }}
            serviceName={selectedService?.name}
            customerName={formData.contactInfo?.fullName}
            customerEmail={formData.contactInfo?.email}
            customerContact={formData.contactInfo?.phoneNumber}
            previewMode={!showPaymentProcessing && selectedPaymentMethod !== 'Online'}
          />
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-black text-center">
              {`Book: ${selectedService.name}`}
            </h2>
            <div className="flex items-center mb-8">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div className={`text-center ${getStepStyle(stepNumber).textColor}`}>
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center border-2 ${getStepStyle(stepNumber).borderColor} ${visitedSteps.includes(stepNumber) ? 'bg-black' : ''}`}>
                      <img src={getStepStyle(stepNumber).icon} alt="Step icon" className="w-6 h-6" />
                    </div>
                    <p className="mt-2 h-10 w-32">
                      {stepNumber === 1 ? "Contact" : stepNumber === 2 ? "Schedule" : "Review"}
                    </p>
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-full mb-10 ${step > stepNumber ? 'bg-black h-1' : 'bg-gray-400 h-0.5'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            {renderFormSteps()}
          </>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
