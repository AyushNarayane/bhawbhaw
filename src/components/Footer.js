import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#85716B] text-white py-12 px-6 md:px-8 font-poppins">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
        
        {/* Logo */}
        <div className="text-center md:text-left md:mr-10">
          <Image
            height={200}
            width={200}
            src="/images/logo2.png"
            alt="Bhaw Logo"
            className="mx-auto md:mx-0"
          />
        </div>

        {/* Opening Hours, Social Media, Contacts */}
        <div className="flex flex-col md:flex-row justify-between w-full space-y-8 md:space-y-0">
          
          {/* Opening Hours */}
          <div className="text-center md:text-left w-full md:w-1/3">
            <h2 className="text-xl font-semibold mb-3">Opening Hours</h2>
            <p className="text-sm mb-2">Mon - Fri: 9:00 AM - 6:00 PM</p>
            <p className="text-sm mb-2">Saturday: 9:00 AM - 6:00 PM</p>
            <p className="text-sm mb-2">Sunday: Closed</p>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-left w-full md:w-1/3">
            <h2 className="text-xl font-semibold mb-3">Social Media</h2>
            <div className="space-y-2 flex flex-col">
              <Link href="#" className="hover:underline text-sm">Twitter ↗</Link>
              <Link href="#" className="hover:underline text-sm">LinkedIn ↗</Link>
              <Link href="#" className="hover:underline text-sm">Facebook ↗</Link>
              <Link href="#" className="hover:underline text-sm">Instagram ↗</Link>
            </div>
          </div>

          {/* Contacts */}
          <div className="text-center md:text-left w-full md:w-1/3">
            <h2 className="text-xl font-semibold mb-3">Contacts</h2>

            {/* Phone */}
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <Image src="/images/footer/call.png" alt="Phone" width={24} height={24} />
              <div className="text-sm">
                <div>8390637497</div>
                <div>8318571489</div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <Image src="/images/footer/mail.png" alt="Email" width={24} height={24} />
              <div className="text-sm">
                <div>info@bhawbhaw.com</div>
                <div>bhawbhaw.com</div>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Image src="/images/footer/map.png" alt="Location" width={24} height={14} />
              <span className="text-sm">Bandra W , Mumbai</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/40 mt-8 pt-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-white">&copy; 2024 bhawbhaw.com</p>
        <div className="space-x-4 mt-2 md:mt-0">
          <Link href="#" className="text-white text-sm hover:underline">Privacy Policy</Link>
          <span className="text-white">|</span>
          <Link href="#" className="text-white text-sm hover:underline">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
