import React, { useEffect, useState } from 'react';
import themeConfig from './themeConfig';
import { Download } from 'lucide-react';

const Navbar = () => {
  const cfg = themeConfig.website;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Navbar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? 'bg-white shadow-sm border-b border-gray-200' : cfg.navbarBg
        } ${cfg.headerBorder}`}
      >
        <div
          className={`flex items-center justify-between h-[80px] transition-all duration-300 ${
            scrolled ? 'px-2 md:px-[100px]' : 'px-4 md:px-[100px]'
          } font-fraunces`}
        >
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <span className="text-lg font-semibold text-gray-800">ilon ai</span>
          </div>

          {/* Center: Nav Links (hide on mobile) */}
          <div className="hidden md:flex flex-grow justify-end mr-6">
            <nav className="flex gap-4 text-sm font-medium">
              {['How to use', 'Usecase', 'Pricing', "FAQ's"].map((label, i) => {
                const href = ['#how-to-use', '#usecase', '#pricing', '#faqs'][i];
                return (
                  <a key={label} href={href} className={cfg.TextHoverEffect}>
                    {label}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Right: Buttons */}
          <div className="flex items-center gap-4">
            <button
              className={`hidden md:inline-flex items-center gap-2 ${cfg.secondaryBtn} px-5 py-2 font-medium transition`}
            >
              <Download size={16} />
              Chrome Extension
            </button>
            <button
              className={`${cfg.primaryBtn} transition font-medium px-3 md:px-5 py-1.5 md:py-2 text-sm md:text-base`}
            >
              Start for Free
            </button>
          </div>
        </div>
      </header>

      {/* Floating Bottom Nav (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow md:hidden font-fraunces">
        <div className="flex justify-around items-center h-14 text-sm font-medium text-gray-700">
          {['How to use', 'Usecase', 'Pricing', "FAQ's"].map((label, i) => {
            const hrefs = ['#how-to-use', '#usecase', '#pricing', '#faqs'];
            return (
              <a key={label} href={hrefs[i]} className={cfg.TextHoverEffect}>
                {label}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
