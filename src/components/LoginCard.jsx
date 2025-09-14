import { useState, useEffect } from 'react';
import themeConfig from './themeConfig';
import analytics from '../services/posthogService';
import { API_BASE_URL } from '../config.js';
import PropTypes from 'prop-types';
import { attachUserToStartLearningChat , findLatestChatStartLearningId } from '../services/chatService';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_ENDPOINT = `${API_BASE_URL}/user/auth/web/google`;

export default function LoginCard({ redirectUri = null, heading }) {
  const cfg = themeConfig.website;

  /* ───────── local state ───────── */
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState('');

  /* ───────── Google Identity Services ───────── */
  useEffect(() => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: false,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large', width: 280 }
      );
      window.google.accounts.id.prompt();
    }
  }, []);

  async function handleCredentialResponse({ credential }) {
    try {
      setLoading(true);
      const res = await fetch(GOOGLE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credential }),
      });

      if (!res.ok) {

        const responseText = await res.text();

        let detail;
        try {
          const jsonResponse = JSON.parse(responseText);
          detail = jsonResponse.detail;
        } catch {
          detail = responseText;
        }
        throw new Error(detail || 'Login failed');
      }

      const { user: backendUser, token: appJwt } = await res.json();
localStorage.setItem(
        'user',
        JSON.stringify({
          email: backendUser.email,
          profile_picture: backendUser.profile_picture,
          name: backendUser.name,
          id: backendUser.id,
        })
      );
      localStorage.setItem('token', appJwt);

      await attachUserToStartLearningChat(backendUser.id);

      const existing_chatStartLearningId = await findLatestChatStartLearningId(backendUser.id)
      if(existing_chatStartLearningId){
        localStorage.setItem("chatStartLearningId" , existing_chatStartLearningId) ;
      }


      //await attachUserToRoadmap(backendUser.id);

      window.dispatchEvent(new CustomEvent('userLoggedIn', {
        detail: { user: backendUser, token: appJwt }
      }));

      window.location.reload();
  } catch (err) {

    setError(err.message);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  } finally {
    setLoading(false);
  }
}

/* ───────── magic-link email flow ───────── */
async function handleVerifyEmail() {
  setError('');
  setEmailError('');
  setSuccess('');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setEmailError('Please enter a valid email address');
    return;
  }

  try {
    setLoading(true);
    analytics.loginEmailSubmitted(email);

    const payload = {
      email,
      login_via: 'website',
    };

    if (redirectUri) {
      payload.redirect_url = redirectUri;
    }

    const res = await fetch(`${API_BASE_URL}/magic-link/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const { detail } = await res.json();
      throw new Error(detail || 'Request failed');
    }

    setSuccess('A verification link has been sent to your email.');
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

/* ───────── UI ───────── */
return (
  <div className="bg-white rounded-xl shadow-md px-6 py-8 w-full max-w-md text-center">
    <h1 className={cfg.authHeading}>
      {heading || "Use ILON AI for 15 mins — you’ll realize YouTube is shit 💩"}
    </h1>

    <div className="login-options mt-6 space-y-6 flex flex-col items-center">
      {/* Google button */}
      <div id="google-signin-button" />

      <input
        type="email"
        placeholder="Enter your email"
        className="w-[280px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleVerifyEmail}
        disabled={loading}
        className={`${cfg.primaryBtn} w-[280px] h-11`}
      >
        {loading ? 'Processing…' : 'Verify Email'}
      </button>

      {(emailError || error) && (
        <p className="text-sm text-red-600 mt-2">{emailError || error}</p>
      )}
      {success && (
        <p className="text-sm text-emerald-600 mt-2 text-center">{success}</p>
      )}

      <p className={`${cfg.authMuted} text-xs mt-1`}>
        By continuing, you agree to our{' '}
        <a
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700"
        >
          T&C and Privacy Policy
        </a>
      </p>
    </div>
  </div>
);
}

LoginCard.propTypes = {
  redirectUri: PropTypes.string,
  heading: PropTypes.string,
};
