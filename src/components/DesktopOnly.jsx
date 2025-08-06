import { useEffect, useState } from 'react';

export default function DesktopOnly({ children }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

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
      <div className="flex items-center justify-center min-h-screen p-4 text-center font-fraunces">
        Elon AI is currently available on desktop. Please use a desktop to access this page.
      </div>
    );
  }

  return <>{children}</>;
}

