import React from 'react';
import { Link } from 'react-router-dom'; // import Link
import themeConfig from './themeConfig';

const Footer = () => {
  const cfg = themeConfig.website;

  return (
    <footer className={`bg-[#fef5ec] ${cfg.borderTop} ${cfg.text}`}>
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-[70px]">
        {/* Left: Logo */}
        <div className="flex justify-between items-start w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <img
              src="https://via.placeholder.com/40"
              alt="Company Logo"
              className="h-10 w-10"
            />
            <span className="font-semibold text-base">ilon ai</span>
          </div>

          {/* Right: Links (mobile only stacked vertically) */}
          <div className="flex flex-col items-end sm:hidden text-right space-y-1">
            {/* <a
              href="https://www.google.com"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome Extension
            </a> */}
            <Link
              to="/privacy-policy"
              className="hover:underline"
            >
              T&C and Privacy Policy
            </Link>
          </div>
        </div>

        {/* Right: Links for larger screens (inline) */}
        <div className="hidden sm:flex items-center gap-6">
          {/* <a
            href="https://www.google.com"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chrome Extension
          </a> */}
          <Link
            to="/privacy-policy"
            className="hover:underline"
          >
            T&C and Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
