import { useEffect, useState } from 'react';

import Navbar from '../components/navbar/Navbar';
import LoginCard from '../components/LoginCard';
import analytics from '../services/posthogService';
import { BackgroundIconCloud } from '../components/BackgroundIconCloud';

export default function GoogleLogin() {
  const [fromRoadmap, setFromRoadmap] = useState(false);

  // Detect special parameters in the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('from') === 'roadmap') {
      setFromRoadmap(true);
    }

    if (params.has('from')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('from');
      window.history.replaceState({}, '', url);
    }
  }, []);

  useEffect(() => {
    analytics.loginPageLoaded();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden font-fraunces">

      <Navbar />

      {/* Decorative background shared across pages */}
      <BackgroundIconCloud />

      {/* Content wrapper above background */}
      <div className="relative z-10 flex items-start justify-center px-[30px] lg:px-[250px] pt-16 pb-10">
        <LoginCard
          heading={fromRoadmap ? 'Sign In to Secure Your Roadmap' : undefined}
        />
      </div>
    </div>
  );
}

