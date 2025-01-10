import Image from 'next/image'; // Ensure you're using next/image for optimized images

const Footer = () => {
  return (
    <footer className="bg-[#85716B] text-white py-8 px-6 md:px-8 font-poppins">
      <div className="max-w-7xl mx-auto my-8 flex flex-col md:flex-row w-full justify-around text-center md:text-left">
        
        {/* Logo */}
        <div className="mb-8 mr-20 px-20 md:mb-0">
          <img src="/images/logo2.png" alt="BHAW Logo" className="w-52 h-52" />
        </div>
        
        {/* Opening Hours */}
        <div className='flex flex-col md:flex-row justify-between w-full'>
          <div className="mb-8 md:mb-0 w-1/3">
            <h2 className="text-lg font-semibold mb-2">Opening Hours</h2>
            <p className="text-sm mb-5">Mon - Fri: 9.00AM - 6.00PM</p>
            <p className="text-sm mb-5">Saturday: 9.00AM - 6.00PM</p>
            <p className="text-sm mb-5">Sunday: Closed</p>
          </div>

          {/* Social Media */}
          <div className="mb-8 ml-16 md:mb-0 w-1/3">
            <h2 className="text-lg font-semibold mb-2">Social Media</h2>
            <p className="mb-5"><a href="#" className="hover:underline text-sm">Twitter ↗</a></p>
            <p className="mb-5"><a href="#" className="hover:underline text-sm">LinkedIn ↗</a></p>
            <p className="mb-5"><a href="#" className="hover:underline text-sm">Facebook ↗</a></p>
            <p className="mb-5"><a href="#" className="hover:underline text-sm">Instagram ↗</a></p>
          </div>

          {/* Contacts */}
          <div className="mb-8 md:mb-0 w-1/3">
            <h2 className="text-lg font-semibold mb-2">Contacts</h2>

            <div className="flex items-center space-x-2 mb-4 text-sm">
              <div className="border border-white w-8 h-8 rounded-lg p-2">
                <Image src="/images/footer/call.png" alt="Phone" width={24} height={24} />
              </div>
              <div>
                <div>8390637497</div>
                <div>8318571489</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4 text-sm">
            <div className="border border-white w-8 h-8 rounded-lg p-2">
                <Image src="/images/footer/mail.png" alt="Phone" width={24} height={24} />
              </div>
              <div>
                <div>info@bhawbhaw.com</div>
                <div>bhawbhaw.com</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
            <div className="border border-white w-10 h-8 rounded-lg p-2">
                <Image src="/images/footer/map.png" alt="Phone" width={24} height={14} className='objext-cover' />
              </div>
              <span>Bandra W , Mumbai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/40 mt-8 pt-4 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-white">&copy; 2024 bhawbhaw.com</p>
        <div className="space-x-4 mt-2 md:mt-0">
          <a href="#" className="text-white text-sm hover:underline">Privacy Policy</a>
          <span className="text-white">|</span>
          <a href="#" className="text-white text-sm hover:underline">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
