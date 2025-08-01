

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Video,
  Book,
  BookOpen,
  UserCircle,
  LogOut,
  Mic,
  Download,
  Shield,
  HelpCircle,
  Info,
  ChevronDown,
  BarChart2,
  User
} from 'lucide-react';
import themeConfig from './themeConfig';
import { useAudioRecorder } from './AudioRecorderContext.jsx';

export default function PlatformNavbar() {
  const cfg = themeConfig.app;
  const [scrolled, setScrolled] = useState(false);
  const { isRecording } = useAudioRecorder();
  const navigate = useNavigate();
  const [isResourcesOpen, setIsResourcesOpen] = useState(false); // State for resources dropdown toggle
  const [isUserOpen, setIsUserOpen] = useState(false); // State for user dropdown
  let username = 'User';
  const storedUser = localStorage.getItem('user');
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
        scrolled ? 'bg-white shadow-sm border-b border-gray-200' : cfg.appHeader
      } ${
        scrolled ? 'px-2 md:px-[100px] h-[80px]' : 'px-4 md:px-[100px] h-[60px]'
      } flex items-center justify-between`}
    >
      <div className="flex items-center gap-6">
        <Link to="/platform" className="flex items-center gap-2 font-semibold">
          <BookOpen size={20} className={cfg.icon} />
          <span>iLon X</span>
        </Link>
        <NavLink
          to="/platform/library"
          className={({ isActive }) =>
            `${cfg.appNavLink} ${isActive ? 'font-bold' : 'font-semibold'} flex items-center gap-1`
          }
        >
          <Book className="w-4 h-4" />
          Library
        </NavLink>
        <NavLink
          to="/platform/lecturehall"
          className={({ isActive }) =>
            `${cfg.appNavLink} ${isActive ? 'font-bold' : 'font-semibold'} flex items-center gap-1`
          }
        >
          <Video className="w-4 h-4" />
          Lecture Hall
        </NavLink>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setIsResourcesOpen(!isResourcesOpen)}
            className={`${cfg.appNavLink} font-semibold flex items-center gap-1`}
          >
            Resources
            <ChevronDown className="w-4 h-4" />
          </button>
          {isResourcesOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
              <NavLink
                to="/platform/install-extension"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsResourcesOpen(false)}
              >
                <Download className="w-4 h-4" />
                Install Extension
              </NavLink>
              <NavLink
                to="/platform/privacy-policy"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsResourcesOpen(false)}
              >
                <Shield className="w-4 h-4" />
                Privacy Policy
              </NavLink>
              <NavLink
                to="/platform/user-guide"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsResourcesOpen(false)}
              >
                <HelpCircle className="w-4 h-4" />
                User Guide
              </NavLink>
              <NavLink
                to="/platform/why-use-ilonx"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsResourcesOpen(false)}
              >
                <Info className="w-4 h-4" />
                Why Use iLon X
              </NavLink>
            </div>
          )}
        </div>
        {isRecording && <Mic size={18} className="text-red-500" />}
        <div className="relative">
          <button
            onClick={() => setIsUserOpen(!isUserOpen)}
            className="flex items-center gap-2"
            aria-haspopup="true"
            aria-expanded={isUserOpen}
          >
            <UserCircle size={20} className={cfg.icon} />
            <span className="text-sm">{username}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {isUserOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-50">
              <NavLink
                to="/platform/stats"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsUserOpen(false)}
              >
                <BarChart2 className="w-4 h-4" />
                Stats
              </NavLink>
              <NavLink
                to="/platform/profile"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsUserOpen(false)}
              >
                <User className="w-4 h-4" />
                Profile
              </NavLink>
              <button
                onClick={() => {
                  setIsUserOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
