import React from 'react';
import { AlertCircle, PlayCircle, Video } from 'lucide-react';
import themeConfig from './themeConfig';
import PlatformNavbar from './PlatformNavbar';
import VideoLinkInputCard from './VideoLinkInputCard';



function OfferingCard({ icon, iconBg, iconColor, title, description, cfg }) {
  return (
    <div className={`${cfg.card} h-[250px] flex flex-col justify-between p-5`}>
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className={`p-3 rounded-full ${iconBg}`}>
          {React.cloneElement(icon, { size: 28, className: iconColor })}
        </div>
        <div className={`${cfg.cardHeadingSecondary}`}>{title}</div>
        <p className={`${cfg.cardSubheading}`}>{description}</p>
      </div>
    </div>
  );
}


function BenefitsSection({ cfg }) {
  return (
    <div className="grid gap-20 mt-16 mb-16 px-4 w-full max-w-[900px] md:grid-cols-3">
      <OfferingCard
        icon={<AlertCircle />}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        title="Ask AI Doubt"
        description="Get instant answers to your questions about the video content from our AI assistant."
        cfg={cfg}
      />
      <OfferingCard
        icon={<PlayCircle />}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        title="Smart Notes"
        description="Take timestamped notes that sync with the video for better retention and review."
        cfg={cfg}
      />
      <OfferingCard
        icon={<Video />}
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
        title="Get timely feedback"
        description="Take AI-generated quizzes based on the video content to test your understanding."
        cfg={cfg}
      />
    </div>
  );
}


export default function PlatformLanding() {
  const cfg = themeConfig.app;
     return (
      <div className='font-fraunces bg-white'>
      <PlatformNavbar />
      <div className="flex flex-col items-center justify-start min-h-screen pt-20">
        <VideoLinkInputCard
          cfg={cfg}
        />
        <div id="how-to-use" className="mt-10 border-2 border-dashed border-gray-400 rounded-xl bg-white flex items-center justify-center text-gray-600 text-base sm:text-lg 
          h-[300px] sm:h-[400px] md:h-[500px] w-[1000px]">
          How to use — there will be a video here in future
        </div>
        <BenefitsSection cfg={cfg} />
      </div>
      </div>
);
   
}
