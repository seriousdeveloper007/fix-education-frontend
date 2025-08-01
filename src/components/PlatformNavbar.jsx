

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Video, Book, BookOpen, UserCircle, LogOut, Mic, Download, Shield, HelpCircle, Info, ChevronDown } from 'lucide-react'; // Added icons for dropdown items and ChevronDown
import themeConfig from './themeConfig';
import { useAudioRecorder } from './AudioRecorderContext.jsx';

export default function PlatformNavbar() {
  const cfg = themeConfig.app;
  const [scrolled, setScrolled] = useState(false);
  const { isRecording } = useAudioRecorder();
  const navigate = useNavigate();
  const [isResourcesOpen, setIsResourcesOpen] = useState(false); // State for dropdown toggle
  let username = 'User';
  const storedUser = localStorage.getItem('user');
  console.log(storedUser)
  if (storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      username = userObj.name || 'User';
    } catch (e) {
      // ignore parse errors and use default username
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (window.google?.accounts?.id?.disableAutoSelect) {
      window.google.accounts.id.disableAutoSelect();
    }
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 font-fraunces ${
        scrolled ? 'bg-white shadow-sm border-b border-gray-200' : cfg.navbarBg
      } ${cfg.headerBorder} ${
        scrolled ? 'px-2 md:px-[100px] h-[80px]' : 'px-4 md:px-[100px] h-[60px]'
      } flex items-center justify-between`}
    >
      <Link to="/platform" className="flex items-center gap-2 font-semibold">
        <BookOpen size={20} className={cfg.icon} />
        <span>iLon X</span>
      </Link>
      
      <nav className="flex items-center gap-4 text-sm relative">
        <NavLink
          to="/platform/library"
          className={({ isActive }) =>
            `${cfg.TextHoverEffect} ${isActive ? 'font-bold' : 'font-semibold'} flex items-center gap-1`
          }
        >
          <Book className="w-4 h-4" />
          Library
        </NavLink>
        <NavLink
          to="/platform/lecturehall"
          className={({ isActive }) =>
            `${cfg.TextHoverEffect} ${isActive ? 'font-bold' : 'font-semibold'} flex items-center gap-1`
          }
        >
          <Video className="w-4 h-4" />
          Lecture Hall
        </NavLink>
        {/* Resources dropdown button */}
        <button
          onClick={() => setIsResourcesOpen(!isResourcesOpen)}
          className={`${cfg.TextHoverEffect} font-semibold flex items-center gap-1`}
        >
          Resources
          <ChevronDown className="w-4 h-4" />
        </button>
        {/* Dropdown menu */}
        {isResourcesOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
            <NavLink
              to="/platform/install-extension" // Adjust path as needed
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsResourcesOpen(false)}
            >
              <Download className="w-4 h-4" />
              Install Extension
            </NavLink>
            <NavLink
              to="/platform/privacy-policy" // Adjust path as needed
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsResourcesOpen(false)}
            >
              <Shield className="w-4 h-4" />
              Privacy Policy
            </NavLink>
            <NavLink
              to="/platform/user-guide" // Adjust path as needed
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsResourcesOpen(false)}
            >
              <HelpCircle className="w-4 h-4" />
              User Guide
            </NavLink>
            <NavLink
              to="/platform/why-use-ilonx" // Adjust path as needed
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsResourcesOpen(false)}
            >
              <Info className="w-4 h-4" />
              Why Use iLon X
            </NavLink>
          </div>
        )}
      </nav>
      <div className="flex items-center gap-4">
        {isRecording && <Mic size={18} className="text-red-500" />}
        <div className="flex items-center gap-2">
          <UserCircle size={20} className={cfg.icon} />
          <span className="text-sm">{username}</span>
          <button onClick={handleLogout} aria-label="Logout" className={`${cfg.icon} flex items-center gap-2`}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
