import Logo from '../../assets/logo-without-bg.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export default function LoggedOutNavbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSignInClick = () => {
    navigate('/login?from=start-learning');
  };

  const handleFeedbackClick = () => {
    navigate('/feedback');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const showSignIn = !pathname.includes('/login');

  return (
    <header className="sticky top-0 z-50 w-full h-16 px-4 sm:px-6 flex items-center justify-between shadow-md bg-white/40 backdrop-blur-lg font-fraunces">
      {/* LEFT: logo + brand */}
      <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLogoClick}>
        <img
          src={Logo}
          alt="ilon ai logo"
          className="w-8 h-8 sm:w-12 sm:h-12 object-contain select-none"
          draggable="false"
        />
        <span className="font-semibold text-sm sm:text-lg">ILON AI</span>
      </div>

      {/* RIGHT: feedback + sign in */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Send Feedback Button */}
        <button
          onClick={handleFeedbackClick}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Send Feedback</span>
        </button>

        {/* Sign In Button */}
        {showSignIn && (
          <button
            onClick={handleSignInClick}
            className="px-4 py-2 bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] hover:from-[#0369a1] hover:to-[#06b6d4] text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}