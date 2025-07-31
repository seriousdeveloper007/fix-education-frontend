import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, BookOpen, GraduationCap, UserCircle, LogOut, Mic } from 'lucide-react';
import themeConfig from './themeConfig';
import { useAudioRecorder } from './AudioRecorderContext.jsx';

export default function PlatformNavbar() {
  const cfg = themeConfig.website;
  const { isRecording } = useAudioRecorder();
  const navigate = useNavigate();
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
      <div className="flex items-center gap-4">
        {/* <button onClick={toggleTheme} aria-label="Toggle theme" className={cfg.icon}>
          {theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>}
        </button> */}
        {isRecording && <Mic size={18} className="text-red-500" />}
        <div className="flex items-center gap-2">
          <UserCircle size={20} className={cfg.icon} />
          <span className="text-sm">{username}</span>
          <button onClick={handleLogout} aria-label="Logout" className={cfg.icon}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
