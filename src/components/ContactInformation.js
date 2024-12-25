import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const ContactInformation = ({ nextStep, handleFormDataChange, formData }) => {
  const [selectedAddress, setSelectedAddress] = useState('');
  const savedAddresses = useSelector((state) => state.addresses.savedAddresses); // Get saved addresses from Redux

  // Handle selecting an address from the dropdown
  const handleAddressSelect = (addressId) => {
    const selected = savedAddresses.find(address => address.id === addressId);
    if (selected) {
      setSelectedAddress(addressId);
      handleFormDataChange({
        fullName: `${selected.firstName} ${selected.lastName}`,
        address: selected.address,
        city: selected.city,
        state: selected.state,
        postalCode: selected.postalCode,
      });
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-gray-700">Select Saved Address</label>
          <select
            value={selectedAddress}
            onChange={(e) => handleAddressSelect(e.target.value)}
            className="mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB]"
          >
            <option value="">Choose an address</option>
            {savedAddresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.address} {/* Assuming each address has a unique 'id' */}
              </option>
            ))}
          </select>
        </div>

        {/* Prefill other fields if a saved address is selected */}
        <div>
          <label className="text-sm text-gray-700">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleFormDataChange({ ...formData, fullName: e.target.value })}
            className="mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB]"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleFormDataChange({ ...formData, email: e.target.value })}
            className="mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB]"
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleFormDataChange({ ...formData, address: e.target.value })}
            className="mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB]"
            placeholder="Enter your address"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Phone Number</label>
          <input
            type="text"
            value={formData.phoneNumber}
            onChange={(e) => handleFormDataChange({ ...formData, phoneNumber: e.target.value })}
            className="mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB]"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Preferred Contact Method</label>
          <select
            value={formData.contactMethod}
            onChange={(e) => handleFormDataChange({ ...formData, contactMethod: e.target.value })}
            className="mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB]"
          >
            <option value="">Choose</option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
          </select>
        </div>

        <div className="col-span-2 flex justify-between items-center">
          <button
            onClick={nextStep}
            className="bg-pink-500 text-white rounded-md px-6 py-2 mt-6 md:mt-0"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
