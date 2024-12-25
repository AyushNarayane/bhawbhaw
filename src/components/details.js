import React from 'react'
// import Image from 'next/image';

const MoreInfo = () => {
  return (
    <div className="m-10 grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl text-gray-600">
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
  )
}

export default MoreInfo
