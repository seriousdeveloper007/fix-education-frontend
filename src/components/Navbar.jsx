import React, { useEffect, useState } from 'react';
import themeConfig from './themeConfig';
import { Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo-without-bg.png';
import { CHROME_EXTENSION_LINK } from '../config.js';




const Navbar = ({
  showNav = true,
  showButtons = true,
  childrenNav = null,
  childrenButtons = null,
}) => {

  const cfg = themeConfig.website;
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const hasScrolled = window.scrollY > 10;
      setScrolled(hasScrolled); // ✅ simplified update
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    console.log('scrolled state changed:', scrolled); // ✅ debug log
  }, [scrolled]);

  return (
    <>
      {/* Top Navbar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? 'bg-white' : `${cfg.navbarBg}`
        }`}
      >
        <div
          className={`flex items-center justify-between h-[80px] transition-all duration-300 ${
            scrolled ? 'px-2 md:px-[100px]' : 'px-4 md:px-[100px]'
          } font-fraunces`}
        >
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-3">
          <img
              src={Logo}
              alt="ilon ai logo"
              className="w-10 h-10 object-contain select-none"
              draggable="false"
            />
            <span className="text-lg font-semibold text-gray-800">ilon AI</span>
          </Link>

          {/* Center: Nav Links (hide on mobile) */}
          {showNav && (
            <div className="hidden md:flex flex-grow justify-end mr-6">
              {childrenNav ?? (
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
              )}
            </div>
          )}

          {/* Right: Buttons */}
          {showButtons && (
            <div className="flex items-center gap-4">
              {childrenButtons ?? (
                <>
                  <button
                    onClick={() => window.open(CHROME_EXTENSION_LINK, '_blank')}
                    className={`hidden md:inline-flex items-center gap-2 ${cfg.secondaryBtn} px-5 py-2 font-medium transition`}
                  >
                    <Download size={16} />
                    Chrome Extension
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className={`${cfg.primaryBtn} transition font-medium px-3 md:px-5 py-1.5 md:py-2 text-sm md:text-base`}
                  >
                    Start for Free
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Floating Bottom Nav (Mobile Only) */}
      {showNav && (
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
      )}
    </>
  );
};

export default Navbar;
