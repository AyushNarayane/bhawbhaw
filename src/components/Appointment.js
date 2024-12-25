import React from 'react';
import Link from "next/link"

const Appointment = () => {
  return (
    <div className="bg-[#2E2624] mx-5 sm:mx-10  text-white p-6 rounded-lg font-poppins">
      <div className='flex flex-col sm:flex-row items-center'>
        <div className="flex-1">
          <h2 className="lg:text-6xl text-4xl leading-tight  font-bold lg:leading-tight">Schedule your appointment today</h2>
          <Link href="/book-service">          
            <button className="mt-4 bg-[#FFEB3B] text-black py-2 px-4 rounded-full">
            Book Now
          </button>
          </Link>

        </div>
        <div className="flex-shrink-0 mt-4 sm:mt-0 sm:ml-6">
          <img
            src="/images/blogs/appointment.png"
            alt="Dog"
            className="w-full sm:w-[28rem] h-72 rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Appointment;
