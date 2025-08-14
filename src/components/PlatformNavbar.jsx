import themeConfig from './themeConfig';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';
import analytics from '../services/posthogService';
import Logo from '../assets/logo-without-bg.png';
import { FolderKanban, BookOpenCheck, LibraryBig } from 'lucide-react';


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
        className={cfg.avatarImage}
        draggable="false"
      />
    );
  }
  return (
    <div className={cfg.avatarFallback}>{emailPrefix.charAt(0).toUpperCase()}</div>
  );
}

export default function PlatformNavbar({ defaultTab = 'My Space' }) {
  const [selected, setSelected] = useState(defaultTab);
  const [userInfo, setUserInfo] = useState({ emailPrefix: '', profilePicture: '' });
  const navigate = useNavigate();
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

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };
  

  const handleTabClick = (tab) => {
    setSelected(tab);
    analytics.navbarOptionClicked(tab);
    switch (tab) {
      case 'My Space':
        navigate('/platform');
        break;
      case 'Study Room':
        navigate('/study-room');
        break;
      case 'Library':
        navigate('/library');
        break;
      default:
        break;
    }
  };

  const handleBrandClick = () => {
    setSelected('My Space');
    analytics.navbarOptionClicked('My Space');
    navigate('/platform');
  };

  const icons = {
    'My Space': <FolderKanban className="w-5 h-5 text-indigo-600 group-hover:text-indigo-800" />,
    'Study Room': <BookOpenCheck className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800" />,
    'Library': <LibraryBig className="w-5 h-5 text-emerald-600 group-hover:text-emerald-800" />,
  };
  

  return (
    <header className={`sticky top-0 z-50 w-full h-16 px-6 flex items-center justify-between shadow-md bg-white/40 backdrop-blur-lg font-fraunces`}>
      {/* LEFT: logo + brand */}
      <div className="flex-1 flex items-center space-x-2 text-left pl-[50px] cursor-pointer" onClick={handleBrandClick}>
        <img src={Logo} alt="ilon ai logo" className="w-12 h-12 object-contain select-none" draggable="false" />
        <span className="font-semibold text-lg"> ILON AI</span>
      </div>

      {/* MID: navigation */}
      <div className="flex-1 flex justify-center items-center space-x-8">
      {['My Space', 'Study Room', 'Library'].map((tab) => (
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

      </div>

      {/* RIGHT: user + dropdown */}
      <div className="flex-1 flex justify-end items-center space-x-2 pr-[50px]" ref={dropdownRef}>
        <UserAvatar profilePicture={userInfo.profilePicture} emailPrefix={userInfo.emailPrefix} />
        <span className="text-sm font-medium text-gray-800 select-none">{userInfo.emailPrefix}</span>
        <div className="relative">
          <ChevronDown className={cfg.dropdownIcon} onClick={() => setDropdownOpen((prev) => !prev)} />
          {dropdownOpen && (
            <div className={cfg.dropdownMenu}>
              <button onClick={handleLogout} className={cfg.dropdownButton}>
                <LogOut className={cfg.dropdownIconButton} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}