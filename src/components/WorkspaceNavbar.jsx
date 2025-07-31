import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, BookOpen, GraduationCap, UserCircle, LogOut } from 'lucide-react';
import themeConfig from './themeConfig';

export default function WorkspaceNavbar({ theme, toggleTheme }) {
  const cfg = themeConfig[theme];
  const navigate = useNavigate();
  const username = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className={`flex items-center justify-between px-4 py-3 border-b ${cfg.headerBorder} ${cfg.headerBg}`}> 
      <Link to="/workspace" className="flex items-center gap-2 font-semibold">
        <BookOpen size={20} className={cfg.icon} />
        <span>EduNote</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <NavLink to="/workspace/library" className={({isActive}) => isActive ? 'font-semibold' : cfg.navLink }>
          Library
        </NavLink>
        <NavLink to="/workspace/lecturehall" className={({isActive}) => isActive ? 'font-semibold' : cfg.navLink }>
          Lecture Hall
        </NavLink>
      </nav>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} aria-label="Toggle theme" className={cfg.icon}>
          {theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>}
        </button>
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
