import React, { useEffect } from 'react';
import { AlertCircle, PlayCircle, Video } from 'lucide-react';
import themeConfig from './themeConfig';
import PlatformNavbar from './PlatformNavbar';
import VideoLinkInputCard from './VideoLinkInputCard';
import DesktopOnly from './DesktopOnly';
import analytics from '../services/posthogService';

function OfferingCard({ icon, iconBg, iconColor, title, description, cfg }) {
  return (
    <div className={`${cfg.card} h-[270px] flex flex-col justify-between p-5`}>
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className={`p-3 rounded-full ${iconBg}`}>
          {React.cloneElement(icon, { size: 28, className: iconColor })}
        </div>
        <div className={cfg.cardHeadingSecondary}>{title}</div>
        <p className={cfg.cardSubheading}>{description}</p>
      </div>
    </div>
  );
}

function BenefitsSection({ cfg }) {
  return (
    <div className="grid gap-20 mt-16 mb-16 px-4 w-full max-w-[900px] md:grid-cols-3">
      <OfferingCard
        icon={<AlertCircle />}
        iconBg="bg-emerald-100/60"
        iconColor="text-emerald-600"
        title="Ask AI Doubt"
        description="Get instant answers to your questions about the video content from our AI assistant."
        cfg={cfg}
      />
      <OfferingCard
        icon={<Video />}
        iconBg="bg-purple-100/60"
        iconColor="text-purple-600"
        title="Get timely feedback"
        description="Get questions every 3 to 5 minutes based on the video to check your understanding as you learn."
        cfg={cfg}
      />
      <OfferingCard
        icon={<PlayCircle />}
        iconBg="bg-blue-100/60"
        iconColor="text-blue-600"
        title="Smart Notes"
        description="Take timestamped notes that sync with the video for better retention and review."
        cfg={cfg}
      />
    </div>
  );
}
export default function PlatformLanding() {
  const cfg = themeConfig.app;
  useEffect(() => {
    analytics.desktopViewLoaded();
  }, []);
  const backgroundClasses = 'min-h-screen bg-white';

  return (
    <DesktopOnly>
      <div className={`font-fraunces ${backgroundClasses}`}>
        <PlatformNavbar />
        <div className="flex flex-col items-center justify-start min-h-screen pt-20">
          <VideoLinkInputCard cfg={cfg} />

          {/* How to use video section */}
          <div
            id="how-to-use"
            className="mt-10 rounded-xl overflow-hidden bg-white/40 backdrop-blur-lg border-2 border-dashed border-gray-400/60"
          >
            <iframe
              width="1000"
              height="500"
              src="https://www.youtube.com/embed/-P1Y8AGWbD4?si=q_SKwkgOZyl4VJPO"
              title="How to use ilon AI"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>

          <BenefitsSection cfg={cfg} />
        </div>
      </div>
    </DesktopOnly>
  );
}
