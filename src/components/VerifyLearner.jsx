import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function VerifyLearner() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('Invalid verification link.');
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`${API_BASE_URL}/magic-link/verify/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          throw new Error('Verification failed');
        }

        const { user, token: appJwt } = await res.json();

        // Save user + token like in handleSuccessfulLogin
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', appJwt);

        setStatus('Verified! Redirecting...');
        navigate('/');
      } catch (err) {
        setStatus(err.message);
      }
    }

    verify();
  }, [searchParams, navigate]);

  return <p>{status}</p>;
}
