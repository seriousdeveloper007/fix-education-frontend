import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import themeConfig from './themeConfig'; // Import themeConfig
import analytics from '../services/posthogService';

const BACKEND_URL = 'http://localhost:8000';

export default function GoogleLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const cfg = themeConfig.website;
  const [success, setSuccess] = useState('');
  const [fromExtension, setFromExtension] = useState(false);


  // Initialize Google Identity Services
  useEffect(() => {

    window.google.accounts.id.initialize({
      client_id: '711989652397-ffcq8cuqec6o2hlr4p7tqc5f8t78aa6c.apps.googleusercontent.com',
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: false,
    });
    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      {
        theme: 'outline',
        size: 'large',
        width: 280, // increase width
      }
  
    );
    window.google.accounts.id.prompt();
    const params = new URLSearchParams(window.location.search);
    if (params.get('from-extension') === 'true') {
      setFromExtension(true);
    
      // Remove the query param without refreshing the page
      const url = new URL(window.location);
      url.searchParams.delete('from-extension');
      window.history.replaceState({}, '', url);
    }
  }, []);

  useEffect(() => {
    analytics.loginPageLoaded();
  }, []);

  async function handleCredentialResponse(response) {
    setLoading(true);
    setError(null);
    try {
      const googleIdToken = response.credential;
      const res = await fetch(`${BACKEND_URL}/user/auth/web/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleIdToken }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Login failed');
      }

      const { user: backendUser, token: appJwt } = await res.json();
      const minimalUser = {
        email: backendUser.email,
        profile_picture: backendUser.profile_picture,
        name: backendUser.name,
        id: backendUser.id
      };      
      localStorage.setItem('user', JSON.stringify(minimalUser));
      localStorage.setItem('token', appJwt);
      navigate('/platform');
    } catch (err) {
      setError(err.message);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/error');
    } finally {
      setLoading(false);
    }
  }

  const handleVerifyEmail = async () => {
    setEmailError('');
    setError(null);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setLoading(true);
    setError(null);
    try {
      analytics.loginEmailSubmitted(email);
      const res = await fetch(`${BACKEND_URL}/magic-link/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          login_via: 'website',
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Request failed');
      }
      setSuccess('We’ve sent a link you an email to verify your address.');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4DEC2] font-fraunces">
      <Navbar showNav={false} showButtons={false} />


      {fromExtension && (
        <div className="fixed top-20 right-8 z-50 w-80 bg-white rounded-2xl shadow-xl p-6 text-center border border-gray-200">
          {/* ilon AI logo and title */}
          <div className="flex items-center justify-center mb-4">
            <img src="https://via.placeholder.com/32x32?text=AI" alt="ilon AI logo" className="mr-2 rounded" />
            <span className="text-xl font-semibold text-gray-900">ilon AI</span>
          </div>

          {/* Heading */}
          <h2 className="text-lg font-bold text-gray-800 mb-2">Pin ilon AI to access later</h2>

          {/* Subtext */}
          <p className="text-sm text-gray-600 mb-4">
            Click the 
            <span className="inline-block mx-1">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABQklEQVR4Ae2WwQnDIAyFnZL4NfgDfgBPkBBK8AfYJWnpYg0UoFJwU95nmKdaIE8e/MFMrfq8wAAmLq7hISfOfjjjz8gA4gUtZMBefIB9WAFrIAm3MdQg0xSKwjQCPCtI2YdDJYWt+OG5HfItZu0BgysMFCYQFBDG7qHgEYTC1Apwl8GnBeHzC84NsckT0Cpw9xA9UJVOX2qFwYRhLGSDIvFFDJTgBK2Qu0DLDKijURnTCQZcMxAzY9WkAdN85TgD9TbDR8iBUc5+x5aaFhhMjI+Oq9k74RrfBDV9tdcKxhwAAAABJRU5ErkJggg==" 
                alt="Pin icon" 
                className="inline-block w-4 h-4 align-middle"
              />
            </span>
            above to pin ilon AI.
          </p>

          {/* Image demo section */}
          <div className="rounded-lg overflow-hidden border border-gray-100">
            <img
              src="data:image/png;base64,REPLACE_THIS_WITH_BASE64_OF_uploaded_image"
              alt="Pin example"
              className="w-full"
            />
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => setFromExtension(false)}
            className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded-lg text-gray-700"
          >
            Dismiss
          </button>
        </div>
      )}


      <div className="flex-grow flex items-start justify-center px-4 pt-16">
        <div className="bg-white rounded-xl shadow-md px-6 py-8 w-full max-w-md text-center">
          <h1 className={cfg.authHeading}>Welcome to ilon ai</h1>
          <p className={`${cfg.authSubheading} mt-2`}>
            ilon ai helps you learn faster by converting your notes into structured, actionable content.
          </p>

          <div className="login-options mt-6 space-y-6 flex flex-col items-center">
            <div id="google-signin-button" />

            <div className="w-[280px] flex items-center text-gray-400 text-sm">
              <hr className="flex-grow border-gray-300" />
              <span className="px-2">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-[280px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleVerifyEmail}
              disabled={loading}
              className={`${cfg.primaryBtn} w-[280px] h-11`}
            >
              {loading ? 'Processing...' : 'Verify Email'}
            </button>
            {(emailError || error) && (
              <p className="text-sm text-red-600 mt-2">
                {emailError || error}
              </p>
            )}
            {success && (
              <p className="text-sm text-emerald-600 mt-2 text-center">{success}</p>
            )}
            <p className={`${cfg.authMuted} text-xs mt-1`}>
              By continuing, you agree to our{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                T&C and Privacy Policy
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
