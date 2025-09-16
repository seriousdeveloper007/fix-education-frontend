import themeConfig from '../themeConfig';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Menu, X, Route, MessageCircle } from 'lucide-react';
import analytics from '../../services/posthogService';
import Logo from '../../assets/logo-without-bg.png';


function UserAvatar({ profilePicture, emailPrefix }) {
  const cfg = themeConfig.app;

  if (profilePicture) {
    return (
      <img
        src={profilePicture}
        alt="User Avatar"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://ui-avatars.com/api/?name=${emailPrefix}`;
        }}

        className={`${cfg.avatarImage} w-6 h-6 sm:w-8 sm:h-8`}
        draggable="false"
      />
    );
  }
  return (
    <div className={`${cfg.avatarFallback} w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm`}>
      {emailPrefix.charAt(0).toUpperCase()}
    </div>
  );
}

export default function PlatformNavbar({ defaultTab = 'Start Learning' }) {
  const [selected, setSelected] = useState(defaultTab);
  const [userInfo, setUserInfo] = useState({ emailPrefix: '', profilePicture: '' });
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const cfg = themeConfig.app;

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        const email = user.email || '';
        const emailPrefix = email.split('@')[0];
        const profilePicture = user.profile_picture;
        setUserInfo({ emailPrefix, profilePicture });
      } catch {
        console.error('Invalid user data in localStorage');
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  //  useEffect for resize handling:
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleFeedbackClick = () => {
    setMobileMenuOpen(false);
    analytics.navbarOptionClicked('Send Feedback');
    navigate('/feedback');
  };


  const handleTabClick = (tab) => {
    setSelected(tab);
    setMobileMenuOpen(false);
    analytics.navbarOptionClicked(tab);
    navigate('/start-learning');
  };

  const handleBrandClick = () => {
    setSelected('Start Learning');

    setMobileMenuOpen(false);
    analytics.navbarOptionClicked('Start Learning');
    navigate('/start-learning');
  };

  const navigationTabs = ['Start Learning'];

  const icons = {
    'Start Learning': <Route className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 group-hover:text-purple-800" />
  };


  return (
    <>
      <header className="sticky top-0 z-50 w-full h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between shadow-md bg-white/40 backdrop-blur-lg font-fraunces">
        {/* LEFT: logo + brand */}

        <div className="flex items-center space-x-2 cursor-pointer" onClick={handleBrandClick}>
          <img
            src={Logo}
            alt="ilon ai logo"
            className="w-8 h-8 sm:w-12 sm:h-12 object-contain select-none"
            draggable="false"
          />
          <span className="font-semibold text-sm sm:text-lg">ILON AI</span>
        </div>

        {/* MID: navigation */}

        <nav className="hidden md:flex items-center space-x-8">
          {navigationTabs.map((tab) => (
            <div
              key={tab}
              onClick={() => handleTabClick(tab)}
              className="flex flex-col items-center group cursor-pointer transition-transform duration-150 hover:-translate-y-0.5"
            >
              <div className="flex items-center space-x-2">
                {icons[tab]}
                <span className={selected === tab ? cfg.tabActive : cfg.tabInactive}>{tab}</span>
              </div>
              {selected === tab && (
                <div className="mt-1 w-full h-[3px] bg-black rounded-full transition-all duration-200" />
              )}
            </div>
          ))}

        </nav>

        {/* RIGHT: user + dropdown */}

        <div className="flex items-center space-x-3">

          {/* Mobile: Send Feedback Button (visible only on mobile) */}
          <button
            onClick={handleFeedbackClick}
            className="md:hidden flex items-center space-x-2 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Feedback</span>
          </button>

          {/* Desktop: Send Feedback Button */}

          <button
            onClick={handleFeedbackClick}
            className="hidden md:flex items-center space-x-2 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Feedback</span>
          </button>
          <div className="flex items-center space-x-2">
            <UserAvatar profilePicture={userInfo.profilePicture} emailPrefix={userInfo.emailPrefix} />
            <span className="hidden sm:block text-xs sm:text-sm font-medium text-gray-800 select-none">
              {userInfo.emailPrefix}
            </span>

            {/* Desktop: Dropdown trigger (hidden on mobile) */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hidden md:flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="User menu"
            >
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Desktop: Dropdown menu */}
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="hidden md:block absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}

            {/* Mobile: Hamburger menu (hidden on desktop) */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div
            ref={mobileMenuRef}
            className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <img src={Logo} alt="ilon ai logo" className="w-8 h-8 object-contain" />
                <span className="font-semibold">ILON AI</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation Items */}
            <nav className="p-4 space-y-2">
              {navigationTabs.map((tab) => (
                <div
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${selected === tab
                    ? 'bg-gray-100 border-l-4 border-black'
                    : 'hover:bg-gray-50'
                    }`}
                >
                  {icons[tab]}
                  <span className={`font-medium ${selected === tab ? 'text-black' : 'text-gray-700'
                    }`}>
                    {tab}
                  </span>
                </div>
              ))}

              {/* Mobile: Send Feedback Button */}
              <div
                onClick={handleFeedbackClick}
                className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-indigo-50"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                <span className="font-medium text-indigo-700">Send Feedback</span>
              </div>
            </nav>

            {/* Mobile User Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserAvatar
                    profilePicture={userInfo.profilePicture}
                    emailPrefix={userInfo.emailPrefix}
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {userInfo.emailPrefix}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}