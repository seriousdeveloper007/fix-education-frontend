import { useEffect, useState } from 'react';
import themeConfig from './themeConfig';

export default function DesktopOnly({ children }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const cfg = themeConfig.app;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center font-fraunces gap-4">
        <div>ilon AI is currently available on laptop/desktop.</div>
        <button className={cfg.primaryButton}>Request Mobile Access</button>
      </div>
    );
  }

  return <>{children}</>;
}
