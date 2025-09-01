
import PropTypes from 'prop-types';
import Logo from '../assets/logo-without-bg.png';
import { useNavigate } from 'react-router-dom';

export default function LoggedOutNavbar({ hideSignup = false }) {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/login?from=roadmap');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 px-6 flex items-center justify-between shadow-md bg-white/40 backdrop-blur-lg font-fraunces">
      {/* LEFT: logo + brand */}
      <div className="flex items-center space-x-2 cursor-pointer">
        <img
          src={Logo}
          alt="ilon ai logo"
          className="w-12 h-12 object-contain select-none"
          draggable="false"
        />
        <span className="font-semibold text-lg">ILON AI</span>
      </div>

      {/* RIGHT: actions */}
      <div className="flex items-center space-x-4">
        {!hideSignup && (
          <button
            onClick={handleSignUpClick}
            className="px-4 py-2 text-[#0284c7] border border-[#0284c7] rounded-lg font-medium hover:bg-[#e0f2fe]"
          >
            Sign Up
          </button>
        )}
        <button
          onClick={handleSignInClick}
          className="px-4 py-2 bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] hover:from-[#0369a1] hover:to-[#06b6d4] text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
        >
          Sign In
        </button>
      </div>
    </header>
  );
}

LoggedOutNavbar.propTypes = {
  hideSignup: PropTypes.bool,
};