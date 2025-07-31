import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:8000';

export default function GoogleLogin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize Google Identity Services client once
  useEffect(() => {
    // if (!window.google) {
    //   setError("Google Identity Services SDK not loaded.");
    //   return;
    // // }
    // if (user) return;

    window.google.accounts.id.initialize({
      client_id: "711989652397-ffcq8cuqec6o2hlr4p7tqc5f8t78aa6c.apps.googleusercontent.com",
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: false,
    });
    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'large' }
    );
    window.google.accounts.id.prompt();
  }, [user]);

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
        throw new Error(errData.detail || "Login failed");
      }

      const { user: backendUser, token: appJwt } = await res.json();
      localStorage.setItem('user', JSON.stringify(backendUser));
      localStorage.setItem('token', appJwt);
      setUser(backendUser);
      navigate('/platform');
    } catch (err) {
      setError(err.message);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/error');
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.google?.accounts?.id.disableAutoSelect();
  }

  // Load existing user
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="flex items-center space-x-4">
      {!user ? (
        <>
          <div id="google-signin-button"></div>
          {loading && <p className="text-sm text-gray-500">Logging in...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </>
      ) : (
        <>
          <span className="text-gray-800">Welcome, {user.name || user.email}</span>
          {user.profile_picture && (
            <img src={user.profile_picture} alt="Profile" className="w-8 h-8 rounded-full" />
          )}
          <button onClick={logout} className="text-sm text-red-600 hover:underline">
            Logout
          </button>
        </>
      )}
    </div>
  );
}
