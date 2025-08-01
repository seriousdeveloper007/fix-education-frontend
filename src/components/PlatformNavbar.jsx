import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  Video,
  Book,
  BookOpen,
  ArrowLeft,
  PencilLine,
  ClipboardList,
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
import { useLectureHall } from './LectureHallContext.jsx';

export default function PlatformNavbar() {
  const cfg = themeConfig.app;
  const [scrolled, setScrolled] = useState(false);
  const { isRecording } = useAudioRecorder();
  const navigate = useNavigate();
  const location = useLocation();
  const { openPanel } = useLectureHall();
  const inLectureHall = location.pathname.startsWith('/platform/lecturehall');
  const [isResourcesOpen, setIsResourcesOpen] = useState(false); // State for resources dropdown toggle
  const [isUserOpen, setIsUserOpen] = useState(false); // State for user dropdown
  const resourcesTimeout = useRef(null);
  const userTimeout = useRef(null);
  let username = 'User';
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      username = userObj.name || 'User';
    } catch {
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
        scrolled ? cfg.appHeader : cfg.appHeader
      } ${
        scrolled ? 'px-2 md:px-[100px] h-[80px]' : 'px-4 md:px-[100px] h-[60px]'
      } flex items-center justify-between`}
    >
      {inLectureHall ? (
        <>
          <div className="flex items-center gap-4">
            <Link to="/platform" className="flex items-center gap-2 font-semibold">
              <BookOpen size={20} className={cfg.icon} />
              <span>iLon X</span>
            </Link>
            <button onClick={() => navigate('/platform')} className={`${cfg.appNavLink} font-semibold flex items-center gap-1`}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
          <div className="flex-1 flex justify-center items-center gap-8">
            <NavLink
              to="/platform/library"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${isActive ? 'bg-emerald-600 text-white' : 'bg-white/80 text-slate-700'} hover:bg-emerald-50 flex items-center gap-1 font-semibold transition-colors`}
            >
              <Book className="w-4 h-4" />
              Library
            </NavLink>
            <NavLink
              to="/platform/user-guide"
              className={`${cfg.appNavLink} font-semibold flex items-center gap-1 px-3 py-2 rounded-md hover:bg-emerald-50`}
            >
              <HelpCircle className="w-4 h-4" />
              User Guide
            </NavLink>
          </div>
          <div className="flex items-center gap-4 ml-auto -mr-4 md:-mr-6">
            <button onClick={() => openPanel('doubt')} className={`${cfg.primaryBtn} flex items-center gap-1 px-3 py-2 text-sm`}>
              <HelpCircle className="w-4 h-4" />
              Ask Doubts
            </button>
            <button onClick={() => openPanel('test')} className={`${cfg.primaryBtn} flex items-center gap-1 px-3 py-2 text-sm`}>
              <ClipboardList className="w-4 h-4" />
              Test Yourself
            </button>
            <button onClick={() => openPanel('notes')} className={`${cfg.primaryBtn} flex items-center gap-1 px-3 py-2 text-sm`}>
              <PencilLine className="w-4 h-4" />
              Write Notes
            </button>
            {isRecording && <Mic size={18} className="text-red-500" />}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <Link to="/platform" className="flex items-center gap-2 font-semibold">
              <BookOpen size={20} className={cfg.icon} />
              <span>iLon X</span>
            </Link>
          </div>
          <div className="flex-1 flex justify-center items-center gap-8">
            <NavLink
              to="/platform/library"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${isActive ? 'bg-emerald-600 text-white' : 'bg-white/80 text-slate-700'} hover:bg-emerald-50 flex items-center gap-1 font-semibold transition-colors`}
            >
              <Book className="w-4 h-4" />
              Library
            </NavLink>
            <NavLink
              to="/platform/lecturehall"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${isActive ? 'bg-emerald-600 text-white' : 'bg-white/80 text-slate-700'} hover:bg-emerald-50 flex items-center gap-1 font-semibold transition-colors`}
            >
              <Video className="w-4 h-4" />
              Lecture Hall
            </NavLink>
          </div>
          <div className="flex items-center gap-4">
            <NavLink
              to="/platform/install-extension"
              className={`${cfg.successBtn} hidden md:flex items-center gap-1 px-3 py-2 text-sm`}
            >
              <Download className="w-4 h-4" />
              Get Extension
            </NavLink>
            <div
              className="relative"
              onMouseEnter={() => {
                if (resourcesTimeout.current) clearTimeout(resourcesTimeout.current);
                setIsResourcesOpen(true);
              }}
              onMouseLeave={() => {
                resourcesTimeout.current = setTimeout(() => setIsResourcesOpen(false), 200);
              }}
            >
              <button className={`${cfg.appNavLink} font-semibold flex items-center gap-1`}>
                Resources
                <ChevronDown className="w-4 h-4" />
              </button>
              <div
                className={`absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50 transition-opacity duration-300 ${
                  isResourcesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
                  <NavLink
                    to="/platform/privacy-policy"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <Shield className="w-4 h-4" />
                    Privacy Policy
                  </NavLink>
                  <NavLink
                    to="/platform/user-guide"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <HelpCircle className="w-4 h-4" />
                    User Guide
                  </NavLink>
                  <NavLink
                    to="/platform/why-use-ilonx"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <Info className="w-4 h-4" />
                    Why Use iLon X
                  </NavLink>
              </div>
            </div>
            {isRecording && <Mic size={18} className="text-red-500" />}
            <div
              className="relative"
              onMouseEnter={() => {
                if (userTimeout.current) clearTimeout(userTimeout.current);
                setIsUserOpen(true);
              }}
              onMouseLeave={() => {
                userTimeout.current = setTimeout(() => setIsUserOpen(false), 200);
              }}
            >
              <button
                className="flex items-center gap-2"
                aria-haspopup="true"
                aria-expanded={isUserOpen}
              >
                <UserCircle size={20} className={cfg.icon} />
                <span className="text-sm">{username}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div
                className={`absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-50 transition-opacity duration-300 ${
                  isUserOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
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
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
