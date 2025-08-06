import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import themeConfig from './themeConfig';

const BACKEND_URL = 'https://api.ilonai.in/';

export default function VerifyLearner() {
  const navigate = useNavigate();
  const location = useLocation();
  const cfg = themeConfig.website;

  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const verifyToken = async () => {
      if (!token) {
        setError('Token is missing');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      try {
        const res = await fetch(`${BACKEND_URL}/magic-link/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });      
        const data = await res.json();
        const { token: authToken, user } = data;
        if (authToken) {
          localStorage.setItem('token', authToken);
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/platform');
        } else {
          throw new Error('Invalid response: missing token');
        }
      } catch (err) {
        setError('Verification failed. Redirecting...');
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
            {error ? 'Verification Failed' : 'Verifying your identity...'}
          </h1>
          <p className={`${cfg.authMuted} mt-3`}>
            {error || 'Please wait a moment.'}
          </p>
        </div>
      </div>
    </div>
  );
}
