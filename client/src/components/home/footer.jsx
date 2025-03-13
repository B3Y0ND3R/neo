import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const PayPalIcon = () => (
  <div className="flex flex-col items-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="h-8 w-auto fill-current text-gray-300 hover:text-purple-500 transition-colors">
      <path d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4.7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9.7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"/>
    </svg>
    <span className="text-gray-300 text-sm mt-2">PayPal</span>
  </div>
);

const BkashIcon = () => (
  <div className="flex flex-col items-center">
    <img 
      src="https://www.logo.wine/a/logo/BKash/BKash-Icon-Logo.wine.svg" 
      alt="bKash" 
      className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
    />
    <span className="text-gray-300 text-sm mt-2">bKash</span>
  </div>
);

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const navigationLinks = isAuthenticated
    ? [
        { name: 'Home', path: '/shop/home' },
        { name: 'Products', path: '/shop/listing' },
        { name: 'About Us', path: '/about' },
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/listings' },
        { name: 'About Us', path: '/about' },
      ];

  const customerLinks = isAuthenticated
    ? [
        { name: 'Contact Us', path: '/contact' },
        { name: 'FAQ', path: '/faq' },
      ]
    : [
        { name: 'Contact Us', path: '/contact' },
        { name: 'FAQ', path: '/faq' },
      ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      {/* Primary Footer */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* About Section - now spans 4 columns */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xl font-bold mb-4 text-white relative inline-block">
              About NEO
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-purple-500"></span>
            </h3>
            <p className="text-gray-300 leading-relaxed pr-8">
              NEO is your premier destination for high-quality products. We strive to provide an exceptional shopping experience with curated selections and outstanding service.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-gray-300 hover:text-purple-500 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-purple-500 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-purple-500 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-purple-500 transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links - now spans 2 columns */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold mb-4 text-white relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-purple-500"></span>
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center">
                    <span className="mr-2">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service - now spans 2 columns */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold mb-4 text-white relative inline-block">
              Customer Service
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-purple-500"></span>
            </h3>
            <ul className="space-y-3">
              {customerLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center">
                    <span className="mr-2">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - now spans 2 columns */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold mb-4 text-white relative inline-block">
              Contact Info
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-purple-500"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <Mail className="w-5 h-5 mr-3 text-purple-500" />
                <span>info@neo.com</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Phone className="w-5 h-5 mr-3 text-purple-500" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 mr-3 text-purple-500" />
                <span>123 Neo Street<br />City, Country</span>
              </li>
            </ul>
          </div>

          {/* Payment Methods - new section */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold mb-4 text-white relative inline-block">
              Payment Methods
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-purple-500"></span>
            </h3>
            <div className="flex flex-wrap gap-6 items-center">
              <PayPalIcon />
              <BkashIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Footer - Copyright */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left">
              &copy; {new Date().getFullYear()} NEO. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  