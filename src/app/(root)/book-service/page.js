"use client";

import React, { useEffect, useState } from 'react';
import ContactInformation from '@/components/ContactInformation';
import CalendarAndSlot from '@/components/CalenderAndSlots';
import ReviewInformation from '@/components/ReviewInformation';
import { db } from 'firebaseConfig';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { clearBookingData, setCalendarAndSlot, setContactInfo, setSelectedService } from '@/redux/serviceSlice';
import { clearUser, setUser } from '@/redux/userSlice';

const MultiStepForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  // const userId = useSelector((state) => state.user.userId);
  const [userId, setUserId] = useState()
  const selectedService = useSelector((state) => state.service.selectedService);

  const [step, setStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState([]);
  const [formData, setFormData] = useState({
    contactInfo: {},
    calendarAndSlot: {},
  });

  // State for saved addresses
  const [savedAddresses, setSavedAddresses] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (!user) {
      router.push('/');
      dispatch(clearUser())
      return;
    } else {
      setUserId(user.userId)
    }

    // Fetch saved addresses from Firestore
    const fetchSavedAddresses = async () => {
      try {
        const addressRef = doc(db, 'users', userId);
        const userDoc = await getDoc(addressRef)

        if (userDoc.exists()) {
          const data = userDoc.data()
          setSavedAddresses(data.addresses)
        }
      } catch (error) {
        console.error("Error fetching saved addresses:", error);
      }
    };

    fetchSavedAddresses();
  }, [selectedService, router, userId]);

  const nextStep = () => {
    if (!visitedSteps.includes(step)) {
      setVisitedSteps([...visitedSteps, step]);
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleFormDataChange = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data,
    }));
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

  const handleSubmit = async () => {
    try {
      // Debug log to check the data structure
      console.log('Form Data:', {
        contactInfo: formData.contactInfo,
        calendarAndSlot: formData.calendarAndSlot,
        selectedService
      });

      // First, get vendor's email from Firestore
      const vendorRef = doc(db, 'vendors', selectedService.vendorId);
      const vendorDoc = await getDoc(vendorRef);
      
      if (!vendorDoc.exists()) {
        throw new Error('Vendor information not found');
      }

      const vendorEmail = vendorDoc.data().personalDetails?.email;
      
      if (!vendorEmail) {
        console.warn('Vendor email not found in vendor document');
      }

      // Create the booking
      const response = await fetch('/api/services/bookService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          formData: {
            selectedService,
            contactInfo: formData.contactInfo,
            calendarAndSlot: formData.calendarAndSlot,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      // Validate required email addresses
      if (!formData.contactInfo?.email) {
        throw new Error('Customer email is required');
      }

      // Format date for email
      const formattedDate = new Date(formData.calendarAndSlot.selectedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Prepare booking details with proper formatting
      const bookingDetails = {
        selectedService,
        contactInfo: {
          ...formData.contactInfo,
          // Ensure full name is properly constructed
          firstName: formData.contactInfo.firstName || '',
          lastName: formData.contactInfo.lastName || '',
        },
        calendarAndSlot: {
          ...formData.calendarAndSlot,
          // Format date and time
          selectedDate: formattedDate,
          selectedSlot: formData.calendarAndSlot.selectedSlot || 'Not specified',
        }
      };

      // Log the final data being sent
      console.log('Sending email notification with:', {
        userEmail: formData.contactInfo.email,
        serviceProviderEmail: vendorEmail,
        bookingDetails
      });

      // If booking is successful, send emails
      const emailResponse = await fetch('/api/services/sendBookingEmails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: formData.contactInfo.email,
          serviceProviderEmail: vendorEmail || 'admin@bhawbhaw.com',
          bookingDetails
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error('Failed to send notification emails:', errorData);
      }

      toast.success('Booking successful');
      dispatch(setSelectedService(null));
      dispatch(clearBookingData());
      router.push('/mybookings');
    } catch (err) {
      console.error('Error during booking:', err);
      toast.error(err.message || 'Booking failed. Please try again.');
    }
  };

  // console.log(selectedService);

  return (
    <div className="flex px-10 flex-col bg-white items-center justify-center font-poppins">
      <div className="w-full bg-white p-8 rounded-lg">
        <Toaster position="top-center" />
        <h2 className="text-2xl font-semibold mb-6 text-black">
          {selectedService ? `Book Your Service for ${selectedService.specialization} in ${selectedService.vendorCity || ''}` : 'Book Your Service'}
        </h2>

        <div className="flex items-center mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div className={`text-center ${getStepStyle(stepNumber).textColor}`}>
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center border-2 ${getStepStyle(stepNumber).borderColor} ${visitedSteps.includes(stepNumber) ? 'bg-black' : ''}`}>
                  <img src={getStepStyle(stepNumber).icon} alt="Step icon" className="w-6 h-6" />
                </div>
                <p className="mt-2 h-10 w-32">
                  {stepNumber === 1
                    ? "Contact Information"
                    : stepNumber === 2
                      ? "Calendar and Slot Choose"
                      : "Review Information"}
                </p>
              </div>
              {stepNumber < 3 && (
                <div className={`w-full mb-10 ${step > stepNumber ? 'bg-black h-1' : 'bg-gray-400 h-0.5'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <ContactInformation
            nextStep={nextStep}
            handleFormDataChange={(data) => handleFormDataChange('contactInfo', data)}
            formData={formData.contactInfo}
            savedAddresses={savedAddresses} // Pass the saved addresses to the contact information step
          />
        )}
        {step === 2 && (
          <CalendarAndSlot
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormDataChange={(data) => handleFormDataChange('calendarAndSlot', data)}
            formData={formData.calendarAndSlot}
          />
        )}
        {step === 3 && (
          <ReviewInformation
            prevStep={prevStep}
            formData={formData}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
