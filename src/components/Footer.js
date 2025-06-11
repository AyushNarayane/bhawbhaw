import React from 'react'
import Link from "next/link";
import Image from 'next/image';
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="bg-[#39646e] text-white py-16 px-5 md:px-10 font-poppins">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:px-16">

        <div className="flex justify-center items-start mb-8 md:mb-0">
          <Image
            width={180}
            height={180}
            src="/images/logo2.png"
            alt="Footer Logo"
          />
        </div>

        <div className="text-center md:text-left">
          <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
          <ul className="text-sm font-light space-y-4">
            <li><Link href="/about" className="hover:underline transition-all">About</Link></li>
            <li><Link href="/contact" className="hover:underline transition-all">Contact Us</Link></li>
            <li><Link href="/careers" className="hover:underline transition-all">Careers</Link></li>
            {/* <li><Link href="/directories">Directories</Link></li> */}
          </ul>
        </div>

        {/* <div className="text-center lg:text-left">
          <h3 className="font-semibold text-lg mb-4">Directories</h3>
          <ul className="text-xs font-extralight space-y-2">
            <li><Link href="/directory?option=sellers">Sellers</Link></li>
            <li><Link href="/directory?option=services">Services</Link></li>
            <li><Link href="/directory?option=products">Products</Link></li>
            <li><Link href="/directory?option=tags">Tags</Link></li>
            <li><Link href="/directory?option=categories">Categories</Link></li>
          </ul>
        </div> */}

        <div className="text-center md:text-left">
          <h3 className="font-semibold text-lg mb-6">Contacts</h3>
          <ul className="space-y-4 text-sm font-light">
            <li className="flex items-center justify-center md:justify-start space-x-3">
              <Image
                width="300"
                height="300"
                src="/images/footer/call.png"
                className="w-7 h-7 border border-white rounded-md p-[5px]"
                alt="Call Icon"
              />
              <span>8390637497<br />8318571489</span>
            </li>
            <li className="flex items-center justify-center md:justify-start space-x-3">
              <Image
                width="300"
                height="300"
                src="/images/footer/mail.png"
                className="w-7 h-7 border border-white rounded-md p-[5px]"
                alt="Email Icon"
              />
              <span>info@bhawbhaw.com<br />www.bhawbhaw.com</span>
            </li>
            <li className="flex items-center justify-center md:justify-start space-x-3">
              <Image
                width="300"
                height="300"
                src="/images/footer/map.png"
                className="w-7 h-7 border border-white rounded-md p-[5px]"
                alt="Location Icon"
              />
              <span>Bandra W , Mumbai</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-12 pt-6 text-center font-light text-sm text-white mx-auto w-full sm:flex sm:justify-between sm:px-10">
        <p className="mb-4 sm:mb-0">
          © 2025 Bhawbhaw.com | <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
        </p>
        <div>
          <ul className="flex justify-center sm:justify-start space-x-5">
            {/* <li><Link href="/"><FaTwitter size={20} /></Link></li> */}
            <li><Link href="https://www.instagram.com/bhaw_bhaww/" className="hover:opacity-75 transition-opacity"><FaInstagram size={20} /></Link></li>
            <li><Link href="https://youtube.com/@bhawbhaw-com?si=c4ryrGze594Jf5xA" className="hover:opacity-75 transition-opacity"><FaYoutube size={20} /></Link></li>
            <li><Link href="https://www.facebook.com/profile.php?id=61568752592399" className="hover:opacity-75 transition-opacity"><FaFacebook size={20} /></Link></li>
            <li><Link href="https://chat.whatsapp.com/LqGNKlnZjS149Fgz1eiRTA" target='_blank' className="hover:opacity-75 transition-opacity"><FaWhatsapp size={20} /></Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Footer;