import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  doc,
  setDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import toast from 'react-hot-toast';

const ContactInformation = ({ nextStep, handleFormDataChange, formData, savedAddresses = [] }) => {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [formVisible, setFormVisible] = useState(false);
  const [formDataForNewAddress, setFormDataForNewAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    state: '',
    postalCode: '',
  });
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCityValid, setIsCityValid] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedService = useSelector((state) => state.service.selectedService);
  const [vendorPincode, setVendorPincode] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.email) {
      setUserEmail(storedUser.email);
    }
    if (storedUser?.userId) {
      setUserId(storedUser.userId);
    }
    dispatch(setUser(storedUser));

    // Fetch vendor's pincode from service
    const fetchVendorPincode = async () => {
      if (selectedService?.id) {
        try {
          // Fetch vendor ID for the selected service
          const servicesRef = doc(db, "serviceProviders", selectedService.id);
          const serviceDoc = await getDoc(servicesRef);
          
          if (serviceDoc.exists()) {
            const vendorId = serviceDoc.data().vendorId;
            
            // Fetch vendor details
            const vendorRef = doc(db, "vendors", vendorId);
            const vendorDoc = await getDoc(vendorRef);
            
            if (vendorDoc.exists()) {
              const vendorData = vendorDoc.data();
              // Use pinCode from businessDetails
              if (vendorData.businessDetails?.pinCode) {
                setVendorPincode(vendorData.businessDetails.pinCode);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching vendor pincode:", error);
        }
      }
    };

    fetchVendorPincode();
  }, [selectedService, dispatch]);

  // Validation logic
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      newErrors.email = emailRegex.test(value) ? '' : 'Please enter a valid email address.';
    } else if (name === 'phoneNumber') {
      const phoneRegex = /^[0-9]{10}$/;
      newErrors.phoneNumber = phoneRegex.test(value) ? '' : 'Phone number must be 10 digits.';
    } else if (name === 'city') {
      if (!value) {
        newErrors.city = 'City is required';
        setIsCityValid(false);
      } else if (selectedService?.vendorCity) {
        // Convert both strings to lowercase for case-insensitive comparison
        const userCity = value.toLowerCase().trim();
        const vendorCity = selectedService.vendorCity.toLowerCase().trim();
        
        // Check if user's city contains vendor's city or vice versa
        if (!userCity.includes(vendorCity) && !vendorCity.includes(userCity)) {
          newErrors.city = `This service is only available in ${selectedService.vendorCity}`;
          setIsCityValid(false);
        } else {
          newErrors.city = '';
          setIsCityValid(true);
        }
      }
    }
    setErrors(newErrors);
  };

  const handleAddressSelect = (addressId) => {
    if (addressId === 'new') {
      setFormVisible(true);
      return;
    }

    const selected = savedAddresses.find((address) => address.id === addressId);
    if (selected) {
      setSelectedAddress(addressId);
      
      // Check if selected address city matches vendor city
      if (selectedService?.vendorCity) {
        const userCity = selected.city.toLowerCase().trim();
        const vendorCity = selectedService.vendorCity.toLowerCase().trim();
        
        if (!userCity.includes(vendorCity) && !vendorCity.includes(userCity)) {
          setErrors({
            ...errors,
            city: `This service is only available in ${selectedService.vendorCity}. Your address is in ${selected.city}`
          });
          setIsCityValid(false);
          toast.error(`This service is only available in ${selectedService.vendorCity}`);
        } else {
          setErrors({...errors, city: ''});
          setIsCityValid(true);
        }
      }
      
      handleFormDataChange({
        fullName: `${selected.firstName} ${selected.lastName}`,
        address: selected.address,
        city: selected.city,
        email: userEmail,
        state: selected.state,
        postalCode: selected.postalCode,
      });
    }
  };

  const handleAddNewAddress = async () => {
    try {
      setIsLoading(true);

      if (!userId) {
        console.error('User ID is undefined.');
        return;
      }

      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      const newAddress = {
        ...formDataForNewAddress,
        id: crypto.randomUUID(),
        createdAt: Timestamp.now(),
      };
      console.log(newAddress);
      

      let updatedAddresses = [];
      if (userDoc.exists()) {
        updatedAddresses = [...(userDoc.data().addresses || []), newAddress];
      } else {
        updatedAddresses = [newAddress];
      }

      await setDoc(userRef, {
        ...userDoc.data(), // Preserve existing user data
        addresses: updatedAddresses,
      });
      console.log(savedAddresses);
      
      // Update the savedAddresses state
      savedAddresses.push(newAddress);

      // Close the form and reset the form data
      setFormVisible(false);
      setFormDataForNewAddress({
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        state: '',
        postalCode: '',
      });
    } catch (error) {
      console.error('Error adding address:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    handleFormDataChange({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleFormDataForNewAddressChange = (field, value) => {
    setFormDataForNewAddress({
      ...formDataForNewAddress,
      [field]: value,
    });
    
    if (field === 'city') {
      validateField('city', value);
    }
  };

  const handleNextStep = () => {
    // Validate required fields
    if (!formData.city) {
      setErrors(prev => ({
        ...prev,
        city: 'City is required to check service availability in your area.'
      }));
      toast.error('Please enter your city to verify service availability.');
      return;
    }

    // Validate city match
    if (!isCityValid) {
      toast.error(`This service is only available in ${selectedService.vendorCity}`);
      return;
    }

    // Check for any other errors
    if (errors.email || errors.phoneNumber) {
      toast.error('Please fix all errors before proceeding.');
      return;
    }
    
    nextStep();
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg text-black">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-gray-700">Select Saved Address</label>
          <select
            value={selectedAddress}
            onChange={(e) => handleAddressSelect(e.target.value)}
            className="mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB]"
          >
            <option value="">Choose an address</option>
            {(savedAddresses || []).map((address) => (
              <option key={address.id} value={address.id}>
                {address.apartment}
              </option>
            ))}
            <option value="new">+ Add New Address</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-700">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB]"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB] ${errors.email ? 'border-red-500' : ''
              }`}
            placeholder="Enter your email address"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-700">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB]"
            placeholder="Enter your address"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">City <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={`mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB] ${errors.city ? 'border-2 border-red-500' : ''}`}
            placeholder="Enter your city"
            required
          />
          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-700">Postal Code</label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            className={`mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB] ${errors.postalCode ? 'border-red-500' : ''}`}
            placeholder="Enter your postal code"
          />
          {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-700">Phone Number</label>
          <input
            type="text"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className={`mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB] ${errors.phoneNumber ? 'border-red-500' : ''}`}
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && (<p className="text-sm text-red-500">{errors.phoneNumber}</p>)}
        </div>

        {formVisible && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Add New Address</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddNewAddress();
                }}
                className="space-y-4"
              >
                {['firstName', 'lastName', 'address', 'apartment', 'state', 'city', 'postalCode'].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formDataForNewAddress[field]}
                    onChange={(e) => handleFormDataForNewAddressChange(field, e.target.value)}
                    className={`w-full px-4 py-3 border rounded-md outline-none ${field === 'city' && errors.city ? 'border-red-500' : ''}`}
                  />
                ))}
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setFormVisible(false)}
                    className="px-4 py-2 bg-gray-300 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="col-span-2 flex justify-between items-center">
          <button
            onClick={handleNextStep}
            className={`px-8 py-3 rounded-md transition-all duration-200 ${
              isCityValid && !errors.email && !errors.phoneNumber
                ? 'bg-black text-white hover:bg-gray-800 cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isCityValid || errors.email || errors.phoneNumber}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;