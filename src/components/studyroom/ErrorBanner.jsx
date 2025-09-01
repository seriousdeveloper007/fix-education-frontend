import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export function ErrorBanner({ error, duration = 2200 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [error, duration]);

  if (!visible || !error) return null;

  return (
    <div className="absolute left-0 right-0 top-0 z-20 px-4">
      <div className="mt-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 shadow-sm">
        {error}
      </div>
    </div>
  );
}

ErrorBanner.propTypes = {
  error: PropTypes.string,
  duration: PropTypes.number
};