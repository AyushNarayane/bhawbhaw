"use client";
import CalendarAndSlot from '../../../components/CalenderAndSlots';
import ContactInformation from '../../../components/ContactInformation';
import ReviewInformation from '../../../components/ReviewInformation';
import React, { useEffect, useState } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { clearBookingData, setCalendarAndSlot, setContactInfo } from '@/redux/serviceSlice';

const MultiStepForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);
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
    if (!selectedService) {
      router.push('/');
    }

    // Fetch saved addresses from Firestore
    const fetchSavedAddresses = async () => {
      try {
        const userDoc = doc(db, "users", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setSavedAddresses(userData.savedAddresses || []); // Assuming the addresses are stored in the `savedAddresses` field
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
      dispatch(setCalendarAndSlot(data));
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

    if (response.ok) {
      toast.success('Booking successful');
      dispatch(clearBookingData());
    } else {
      console.error('Booking failed');
    }
  };

  return (
    <div className="flex px-10 flex-col bg-white items-center justify-center font-montserrat">
      <div className="w-full bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-black">Book Your Service</h2>

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
