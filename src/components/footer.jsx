import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import apple from '../public/images/apple.png';
import googlePlay from '../public/images/palystore.png';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* ASRA Section */}
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <h3 className="text-lg font-semibold text-[#1F5546]">ASRA</h3>
              <h3 className="text-lg font-semibold text-[#EAB308] ml-1">CHAUFFEUR</h3>
            </div>
            <p className="text-sm text-[#5E6282] leading-relaxed">
              Book your ride in minutes, get full control for much longer.
            </p>
          </div>

          {/* Company Section */}
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-base font-semibold text-gray-900">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-base font-semibold text-gray-900">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Help/FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Booking
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* More Section */}
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-base font-semibold text-gray-900">More</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Fleet
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Booking
                </a>
              </li>
            </ul>
          </div>

          {/* Social & App Links */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            {/* Social Media Links */}
            <div className="flex space-x-2">
              <a
                href="#"
                className="w-8 h-8 bg-white shadow-2xl shadow-[#1F5546] rounded-full flex items-center justify-center hover:bg-[#1F5546] transition-colors"
              >
                <Facebook className="w-4 h-4 text-black" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-[#1F5546] rounded-full flex items-center justify-center hover:bg-[#1F5546] transition-colors"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-white shadow-2xl rounded-full flex items-center justify-center hover:bg-[#1F5546] transition-colors"
              >
                <Twitter className="w-4 h-4 text-black" />
              </a>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col space-y-2 w-full max-w-[160px]">
              {/* App Store Button */}
              <a href="#" className="bg-black text-white px-4 py-2 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors text-xs w-full">
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  <Image src={apple} alt="Apple" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-medium leading-tight">Download on the</p>
                  <p className="text-xs font-semibold leading-tight">App Store</p>
                </div>
              </a>
              
              {/* Google Play Button */}
              <a href="#" className="bg-black text-white px-4 py-2 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors text-xs w-full">
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  <Image src={googlePlay} alt="Google Play" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-medium leading-tight">GET IT ON</p>
                  <p className="text-xs font-semibold leading-tight">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            All rights reserved © asrachauffeur.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;