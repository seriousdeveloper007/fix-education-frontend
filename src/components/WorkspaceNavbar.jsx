import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  BookOpen,
  UserCircle,
  LogOut,
  Mic,
  BarChart2,
  User,
} from 'lucide-react';
import themeConfig from './themeConfig';
import { useAudioRecorder } from './AudioRecorderContext.jsx';
import { useState, useEffect, useRef } from 'react';

export default function WorkspaceNavbar({ theme, toggleTheme }) {
  const cfg = themeConfig[theme];
  const { isRecording } = useAudioRecorder();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  let username = 'User';
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      username = userObj.name || userObj.username || 'User';
    } catch (e) {
      // ignore parse errors and use default username
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (window.google?.accounts?.id?.disableAutoSelect) {
      window.google.accounts.id.disableAutoSelect();
    }
    navigate('/');
  };

  return (
    <header className={`flex items-center justify-between px-4 py-3 border-b ${cfg.headerBorder} ${cfg.headerBg}`}> 
      <Link to="/platform" className="flex items-center gap-2 font-semibold">
        <BookOpen size={20} className={cfg.icon} />
        <span>EduNote</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <NavLink to="/platform/library" className={({isActive}) => isActive ? 'font-semibold' : cfg.navLink }>
          Library
        </NavLink>
        <NavLink to="/platform/lecturehall" className={({isActive}) => isActive ? 'font-semibold' : cfg.navLink }>
          Lecture Hall
        </NavLink>
      </nav>
      <div className="flex items-center gap-4 relative" ref={menuRef}>
        <button onClick={toggleTheme} aria-label="Toggle theme" className={cfg.icon}>
          {theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>}
        </button>
        {isRecording && <Mic size={18} className="text-red-500" />}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="User menu"
          className="flex items-center gap-2"
        >
          <UserCircle size={20} className={cfg.icon} />
          <span className="text-sm">{username}</span>
        </button>
        {menuOpen && (
          <div
            className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg z-10 ${cfg.cardBg}`}
          >
            <NavLink
              to="/platform/stats"
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              <BarChart2 size={16} /> Stats
            </NavLink>
            <NavLink
              to="/platform/profile"
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              <User size={16} /> Profile
            </NavLink>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
