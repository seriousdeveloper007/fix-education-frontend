import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import themeConfig from '../config/themeConfig';
import { API_BASE_URL } from '../config/config.js';
import { updateChat } from '../services/chatService.js';

export default function VerifyLearner() {
  const navigate = useNavigate();
  const location = useLocation();
  const cfg = themeConfig.website;

  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams   = new URLSearchParams(location.search);
    const token         = queryParams.get('token');
    const redirectParam = queryParams.get('redirect_url');          // may be null

    const getSafeRedirect = (url) => {
      if (!url) return null;
      try {
        const parsed = new URL(url, window.location.origin); // handles relative & absolute
        return parsed.origin === window.location.origin ? parsed.pathname + parsed.search + parsed.hash : null;
      } catch {
        return null;
      }
    };

    const safeRedirect = getSafeRedirect(redirectParam);

    const verifyToken = async () => {
      if (!token) {
        setError('Token is missing');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/magic-link/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        const { token: authToken, user } = data;

        if (!authToken) throw new Error('Invalid response: missing token');

        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(user));

        // If an anonymous chat exists, attach it to the logged-in user
        const chatRoadmapId = localStorage.getItem('chatRoadmapId');
        const chatId = localStorage.getItem('chatId');
        if (chatRoadmapId || chatId) {
          try {
            await updateChat({ user_id: user.id });
          } catch (err) {
            console.error('Failed to update chat with user', err);
          }
        }

        // use replace so verification page doesn’t stay in history stack
        navigate(safeRedirect || '/platform', { replace: true });
      } catch (err) {
        console.error(err);
        setError('Verification failed. Redirecting…');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    verifyToken();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4DEC2] font-fraunces">
      <Navbar showNav={false} showButtons={false} />
      <div className="bg-[#fdebd0] flex-grow px-2 pt-12 flex justify-center">
        <div className="bg-white rounded-xl shadow-md px-6 py-4 w-full max-w-md text-center h-[300px] flex flex-col justify-center">
          <h1 className={cfg.authHeading}>
            {error ? 'Verification Failed' : 'Verifying your identity…'}
          </h1>
          <p className={`${cfg.authMuted} mt-3`}>
            {error || 'Please wait a moment.'}
          </p>
        </div>
      </div>
    </div>
  );
}
