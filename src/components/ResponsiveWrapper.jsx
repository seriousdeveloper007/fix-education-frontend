import { useEffect, useState } from 'react';
import analytics from '../services/posthogService';

export default function ResponsiveWrapper({ children }) {
  const [deviceType, setDeviceType] = useState(() => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newDeviceType;
      if (width < 768) newDeviceType = 'mobile';
      else if (width < 1024) newDeviceType = 'tablet';
      else newDeviceType = 'desktop';
      
      if (newDeviceType !== deviceType) {
        setDeviceType(newDeviceType);
        analytics.deviceTypeChanged?.(newDeviceType);
      }
    };

    // Log initial device type for analytics
    analytics.responsiveViewLoaded?.(deviceType);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [deviceType]);

  return (
    <div className={`responsive-wrapper ${deviceType}`} data-device={deviceType}>
      {children}
    </div>
  );
}