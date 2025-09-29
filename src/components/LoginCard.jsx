import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { API_BASE_URL } from '../config.js';

export default function LoginCard({ heading = 'Sign in with your email' }) {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const redirect = searchParams.get('redirect');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: null, message: '' });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email,
        login_via: 'website',
      };

      if (redirect) {
        payload.redirect_url = redirect;
      }

      const response = await fetch(`${API_BASE_URL}/magic-link/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const { detail } = await response.json().catch(() => ({ detail: 'Unable to send email.' }));
        throw new Error(detail || 'Unable to send email.');
      }

      setStatus({
        type: 'success',
        message: 'A login link has been sent to your email address.',
      });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h1 className="login-card__heading">{heading}</h1>

      <form className="login-card__form" onSubmit={handleSubmit}>
        <label className="login-card__label" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="login-card__input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
        />

        <button type="submit" className="login-card__button" disabled={loading}>
          {loading ? 'Sending…' : 'Send magic link'}
        </button>
      </form>

      {status.message && (
        <p className={`login-card__status login-card__status--${status.type}`}>
          {status.message}
        </p>
      )}
    </div>
  );
}

LoginCard.propTypes = {
  heading: PropTypes.string,
};
