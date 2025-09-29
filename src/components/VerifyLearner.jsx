import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config.js';

export default function VerifyLearner() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying your link…');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('This verification link is invalid.');
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/magic-link/verify/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const { detail } = await response
            .json()
            .catch(() => ({ detail: 'Verification failed.' }));
          throw new Error(detail || 'Verification failed.');
        }

        setStatus('Success! Redirecting you to the login page…');
        setTimeout(() => navigate('/login'), 1500);
      } catch (error) {
        setStatus(error.message);
      }
    };

    verify();
  }, [searchParams, navigate]);

  return <p className="verify-status">{status}</p>;
}
