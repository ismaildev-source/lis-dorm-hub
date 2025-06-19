
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-400">LIS Dorm Karen</h3>
            <p className="text-gray-300">
              The leading Dormitory Prep Attendance management.
            </p>
            <div className="flex space-x-4">
              <a href="https://web.facebook.com/photo/?fbid=237439805562479&set=a.237439782229148&__tn__=%3C" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/lis.nairobi/" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/company/light-international-school/" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#facilities" className="text-gray-300 hover:text-white transition-colors">Facilities</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              <li><a href="https://lis.sc.ke/wp-content/uploads/2024/09/LIS-Karen-2024-2025-Fees-Structure.pdf" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="https://lis.sc.ke" className="text-gray-300 hover:text-white transition-colors">School Website</a></li>
              <li><a href="https://lgs.sis.cool/UI/" className="text-gray-300 hover:text-white transition-colors">Student Portal</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>support@lis.sc.ke</span>
              </div>
              <p>LIGHT INTERNATIONAL SCHOOL DORMITORY</p>
              <p>P.O. BOX 1799-00502</p>
              <p>KAREN NAIROBI KENYA</p>
              <p>Tel:+254 703 200 002</p>
              <p>E-mail: info@lis.sc.ke</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Developer Mr.Ismail. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
