"use client";
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

const ContactUs = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  const [serviceInfo, setServiceInfo] = useState({
    service: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value,
    });
  };

  const handleServiceInfoChange = (e) => {
    const { name, value } = e.target;
    setServiceInfo({
      ...serviceInfo,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!personalInfo.name.trim()) newErrors.name = 'Name is required';
    if (!personalInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!personalInfo.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[0-9]{7,15}$/.test(personalInfo.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    if (!serviceInfo.service.trim()) newErrors.service = 'Service is required';
    if (!serviceInfo.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/contactUs/contactUs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({personalInfo, serviceInfo}),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact information');
      }

      setPersonalInfo({
        name: '',
        email: '',
        phoneNumber: '',
      });
      setServiceInfo({
        service: '',
        message: '',
      });
      setErrors({});
      toast.success('Contact information submitted successfully.');
    } catch (error) {
      console.error('Error submitting contact information:', error);
      alert('Error submitting contact information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-white p-10'>
      <div className="flex flex-col items-center text-black p-8 font-poppins bg-white lg:px-16">
        <h1 className="lg:text-8xl text-4xl font-extrabold text-[#85716B]">Contact us</h1>
        <p className="text-center lg:mx-32 text-gray-600 mt-2">
          We know your pets are cherished members of your family. That&apos;s why we provide loving, personalized pet sitting services tailored to their needs.
        </p>

        <div className="mt-8 w-full p-6 rounded-lg border border-[#F3EAE7]">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="text-[#846F67] text-2xl">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={personalInfo.name}
                onChange={handlePersonalInfoChange}
                className="mt-1 p-2 border rounded-md text-gray-600 bg-[#F3EAE7]"
                required
              />
              {errors.name && <span className="text-red-600">{errors.name}</span>}
            </div>
            <div className="flex flex-col">
              <label className="text-[#846F67] text-2xl">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Example@youremail.com"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                className="mt-1 p-2 border rounded-md text-gray-600 bg-[#F3EAE7]"
                required
              />
              {errors.email && <span className="text-red-600">{errors.email}</span>}
            </div>
            <div className="flex flex-col">
              <label className="text-[#846F67] text-2xl">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="+777 666 8888"
                value={personalInfo.phoneNumber}
                onChange={handlePersonalInfoChange}
                className="mt-1 p-2 border rounded-md text-gray-600 bg-[#F3EAE7]"
                required
              />
              {errors.phoneNumber && <span className="text-red-600">{errors.phoneNumber}</span>}
            </div>

            <div className="flex flex-col">
              <label className="text-[#846F67] text-2xl">Service</label>
              <input
                type="text"
                name="service"
                placeholder="Ex Dog walking"
                value={serviceInfo.service}
                onChange={handleServiceInfoChange}
                className="mt-1 p-2 border rounded-md text-gray-600 bg-[#F3EAE7]"
                required
              />
              {errors.service && <span className="text-red-600">{errors.service}</span>}
            </div>
            <div className="md:col-span-2 flex flex-col">
              <label className="text-[#846F67] text-2xl">Message</label>
              <textarea
                name="message"
                placeholder="Write your message here.."
                value={serviceInfo.message}
                onChange={handleServiceInfoChange}
                className="mt-1 p-2 border rounded-md text-[#85716B] bg-[#F3EAE7] h-24"
                required
              />
              {errors.message && <span className="text-red-600">{errors.message}</span>}
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className={`w-full bg-[#FFEB3B] text-[#4D413E] py-2 px-4 rounded-md text-2xl ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ClipLoader size={20} color="#fff" className="mx-10"/>
                ) : 'Book Now'}
              </button>
            </div>
          </form>
        </div>

        <div className=" grid grid-cols-1 mt-5 md:grid-cols-3 gap-4 bg-[#F3EAE7] rounded-xl text-gray-600">
          <div className="flex items-center space-x-4 p-4">
            <img src="/images/contact/clock.png" alt="Clock" className="w-16 h-16" />
            <div>
              <h4 className="font-staatliches text-[#4D413E] text-2xl">OPEN HOURS</h4>
              <p className='text-sm' >Mon - Fri: 9:00 AM to 6:00 PM</p>
              <p className='text-sm' >Saturday: 9:00 AM to 2:00 PM</p>
              <p className='text-sm' >Sunday: 9:00 AM to 2:00 PM</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4">
            <img src="/images/contact/location.png" alt="Location" className="w-16 h-16" />
            <div>
              <h4 className="font-staatliches text-[#4D413E] text-2xl">LOCATION</h4>
              <p className='text-sm' >123 Maple Street, Springfield, Anytown, USA</p>
              <a href="#" className="text-[#FFEB3B]">See on map</a>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4">
            <img src="/images/contact/phone.png" alt="Phone" className="w-16 h-16" />
            <div>
              <h4 className="font-staatliches text-[#4D413E] text-2xl">CONTACT</h4>
              <p className='text-sm' >648-423-2785</p>
              <p className='text-sm' >Contact@gatito.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
