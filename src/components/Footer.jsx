import React from 'react';
import themeConfig from './themeConfig';

const Footer = () => {
  const cfg = themeConfig.website;
  return (
    <footer className={`bg-white ${cfg.borderTop} ${cfg.text}`}>
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <img
            src="https://via.placeholder.com/40"
            alt="Company Logo"
            className="h-10 w-10"
          />
          <span className="font-semibold">ilon ai</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="https://www.google.com"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chrome Extension
          </a>
          <a
            href="https://www.google.com"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms &amp; Conditions
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
