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
    city: '',
    postalCode: '',
  });
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedService = useSelector((state) => state.service.selectedService);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.email) {
      setUserEmail(storedUser.email);
    }
    if (storedUser?.userId) {
      setUserId(storedUser.userId);
    }
    dispatch(setUser(storedUser))
  }, []);

  // Handle selecting an address from the dropdown
  const handleAddressSelect = (addressId) => {
    if (addressId === 'new') {
      setFormVisible(true);
      return;
    }

    const selected = savedAddresses.find((address) => address.id === addressId);
    if (selected) {
      setSelectedAddress(addressId);
      
      // Check if selected address city matches vendor city
      if (selectedService?.vendorCity && selected.city.toLowerCase() !== selectedService.vendorCity.toLowerCase()) {
        setErrors({
          ...errors,
          city: `This service is only available in ${selectedService.vendorCity}. Your address is in ${selected.city}`
        });
        toast.error(`This service is only available in ${selectedService.vendorCity}`);
      } else {
        setErrors({...errors, city: ''});
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
      savedAddresses.push(newAddress)

      // Close the form and reset the form data
      setFormVisible(false);
      setFormDataForNewAddress({
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        state: '',
        city: '',
        postalCode: '',
      });
    } catch (error) {
      console.error('Error adding address:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
      // Check if user city matches vendor city
      if (selectedService?.vendorCity && value.toLowerCase() !== selectedService.vendorCity.toLowerCase()) {
        newErrors.city = `This service is only available in ${selectedService.vendorCity}`;
      } else {
        newErrors.city = '';
      }
    }
    setErrors(newErrors);
  };

  const handleInputChange = (name, value) => {
    handleFormDataChange({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleContinue = () => {
    // Check if there are any validation errors
    if (errors.email || errors.phoneNumber || errors.city) {
      toast.error("Please resolve all errors before continuing");
      return;
    }
    
    // Verify the city matches the vendor's city
    if (selectedService?.vendorCity && formData.city && 
        formData.city.toLowerCase() !== selectedService.vendorCity.toLowerCase()) {
      setErrors({
        ...errors,
        city: `This service is only available in ${selectedService.vendorCity}`
      });
      toast.error(`You can only book this service if you're in ${selectedService.vendorCity}`);
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
          <label className="text-sm text-gray-700">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={`mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB] ${errors.city ? 'border-red-500' : ''}`}
            placeholder="Enter your city"
          />
          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
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
                {['firstName', 'lastName', 'address', 'apartment', 'state', 'city', 'postalCode',].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formDataForNewAddress[field]}
                    onChange={(e) =>
                      setFormDataForNewAddress({
                        ...formDataForNewAddress,
                        [field]: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border rounded-md outline-none"
                  />
                ))}

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
            onClick={handleContinue}
            className="bg-black text-white px-8 py-3 rounded-md"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;