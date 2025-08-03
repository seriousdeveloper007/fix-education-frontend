import themeConfig from './themeConfig';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';


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
      />
    );
  }

  return (
    <div className={cfg.avatarFallback}>
      {emailPrefix.charAt(0).toUpperCase()}
    </div>
  );
}




export default function PlatformNavbar({ defaultTab = 'Home' }) {
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
        const profilePicture = user.profile_picture
        console.log("profile picture", profilePicture)
        setUserInfo({ emailPrefix, profilePicture });
        console.log("userInfo", userInfo);

      } catch (err) {
        console.error('Invalid user data in localStorage');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload(); // or redirect to login
  };

  const handleTabClick = (tab) => {
    setSelected(tab);
    switch (tab) {
      case 'Home':
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

  
  return (
    <header
      className={`sticky top-0 z-50 w-full h-16 px-6 flex items-center justify-between shadow-md ${cfg.appHeader} font-fraunces`}
    >
      {/* Left: Logo and Brand */}
      <div className="flex-1 flex items-center space-x-2 text-left pl-[50px]">
        <img
          alt="Ilon Logo"
          className="w-8 h-8 rounded"
        />
        <span className="font-semibold text-lg">ilon AI</span>
      </div>

      {/* Mid navigation */}
      <div className="flex-1 flex justify-center items-center space-x-8">
        {['Home', 'Study Room', 'Library'].map((tab) => {
          const emoji = {
            'Home': '🏠',
            'Study Room': '📚',
            'Library': '📖',
          }[tab];

          return (
            <div
              key={tab}
              onClick={() => handleTabClick(tab)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{emoji}</span>
                <span className={selected === tab ? cfg.tabActive : cfg.tabInactive}>
                  {tab}
                </span>
              </div>
              {selected === tab && (
                <div className="mt-1 w-full h-[3px] bg-black rounded-full" />
              )}
            </div>
          );
        })}
      </div>

    {/* Right: User Info with Dropdown */}
    <div className="flex-1 flex justify-end items-center space-x-2 pr-[50px]" ref={dropdownRef}>
      <UserAvatar profilePicture={userInfo.profilePicture} emailPrefix={userInfo.emailPrefix} />
        <span className={cfg.emailText}>{userInfo.emailPrefix}</span>
        <div className="relative">
          <ChevronDown
            className={cfg.dropdownIcon}
            onClick={() => setDropdownOpen((prev) => !prev)}
          />
          {dropdownOpen && (
            <div className={cfg.dropdownMenu}>
              <button
                onClick={handleLogout}
                className={cfg.dropdownButton}
              >
                <LogOut className={cfg.dropdownIconButton} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
