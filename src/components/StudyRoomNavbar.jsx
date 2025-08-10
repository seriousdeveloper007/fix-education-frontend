import themeConfig from './themeConfig';
import { useEffect, useRef, useState } from 'react';
import { updateTab } from '../services/tabService';
import { ArrowLeft, MessageSquare, Notebook, PencilLine } from 'lucide-react';

export default function StudyRoomNavbar({
  videoUrl,
  onTabSelect,
  selectedTab,
  getCurrentTime,
  getDuration,
  unattemptedQuestionCount,
}) {
  const cfg = themeConfig.app;
  const prevCountRef = useRef(unattemptedQuestionCount);
  const [animateAttemptTab, setAnimateAttemptTab] = useState(false);

  useEffect(() => {
    if (unattemptedQuestionCount > prevCountRef.current) {
      setAnimateAttemptTab(true);
      const timeout = setTimeout(() => setAnimateAttemptTab(false), 1200);
      return () => clearTimeout(timeout);
    }
    prevCountRef.current = unattemptedQuestionCount;
  }, [unattemptedQuestionCount]);

  const tabs = [
    {
      label: 'Ask Doubt',
      icon: <MessageSquare className="w-7 h-5 text-indigo-600 group-hover:text-indigo-800" />,
    },
    {
      label: 'Attempt Question',
      icon: <PencilLine className="w-7 h-5 text-cyan-600 group-hover:text-cyan-800" />,
    },
    {
      label: 'Take Notes',
      icon: <Notebook className="w-7 h-5 text-cyan-600 group-hover:text-cyan-800" />,
    },
    // Future tab (example): { label: 'Take Notes', icon: <StickyNote /> }
  ];

  const handleBack = async () => {
    const last_playback_time = Math.floor(getCurrentTime?.() || 0);
    const video_length = getDuration?.() || 0;
    await updateTab(last_playback_time, video_length);

    const url = new URL(videoUrl);
    url.searchParams.set('t', `${last_playback_time}s`);
    const encodedUrl = encodeURIComponent(url.toString());
    window.location.href = `/study-room?video=${encodedUrl}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 px-6 flex items-center justify-between shadow-md bg-white/40 backdrop-blur-lg font-fraunces">
      {/* LEFT: Back Button */}
      <div className="flex-1 flex items-center pl-[50px]">
        <div
          onClick={handleBack}
          className="flex items-center space-x-2 cursor-pointer transition-transform duration-150 hover:-translate-x-0.5 select-none"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 hover:text-black" />
          <span className="text-sm text-gray-700 hover:text-black font-medium">Back</span>
        </div>
      </div>

      {/* MID: Tab Navigation */}
      <div className="flex-1 flex justify-center items-center space-x-8">
        {tabs.map((tab) => {
          const isAttemptTab = tab.label === 'Attempt Question';
          const hasCount = isAttemptTab && unattemptedQuestionCount > 0;

          return (
            <div
              key={tab.label}
              onClick={() => onTabSelect(tab.label)}
              className={`flex flex-col items-center group cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 ${
                isAttemptTab && animateAttemptTab ? 'animate-bounce animate-pulse' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                {tab.icon}
                <span className={selectedTab === tab.label ? cfg.tabActive : cfg.tabInactive}>
                  {tab.label}
                  {hasCount && (
                    <span className="text-red-600 font-semibold ml-1">
                      ({unattemptedQuestionCount})
                    </span>
                  )}
                </span>
              </div>
              {selectedTab === tab.label && (
                <div className="mt-1 w-full h-[3px] bg-black rounded-full transition-all duration-200" />
              )}
            </div>
          );
        })}
      </div>

      {/* RIGHT: Spacer */}
      <div className="flex-1 pr-[50px]" />
    </header>
  );
}
