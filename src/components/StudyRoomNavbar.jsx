import themeConfig from './themeConfig';
import { useEffect, useRef, useState } from 'react';
import { updateTab } from '../services/tabService';
import { ArrowLeft, MessageSquare, PencilLine, Code } from 'lucide-react';

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
      label: 'Code from Video',
      icon: <Code className="w-7 h-5 text-emerald-600 group-hover:text-emerald-800" />,
    },
    // {
    //   label: 'Take Notes',
    //   icon: <Notebook className="w-7 h-5 text-cyan-600 group-hover:text-cyan-800" />,
    // },
    // Future tab (example): { label: 'Take Notes', icon: <StickyNote /> }
  ];
  // General function to update tab details - called by all clickable elements
  const handleUpdateTabDetails = async () => {
    console.log("Updating tab details...");
    const last_playback_time = Math.floor(getCurrentTime?.() || 0);
    const video_length = getDuration?.() || 0;
    await updateTab(last_playback_time, video_length);
  };

  // Wrapper function for back button - updates tab details then navigates
  const handleBack = async () => {
    console.log("Back clicked");
    await handleUpdateTabDetails();

    const last_playback_time = Math.floor(getCurrentTime?.() || 0);
    const url = new URL(videoUrl);
    url.searchParams.set('t', `${last_playback_time}s`);
    const encodedUrl = encodeURIComponent(url.toString());
    window.location.href = `/study-room?video=${encodedUrl}`;
  };

  // Wrapper function for tab selection - updates tab details then selects tab
  const handleTabSelect = async (tabLabel) => {
    onTabSelect(tabLabel);
  };


  return (
    <header className="sticky top-0 z-50 w-full bg-white/40 backdrop-blur-lg shadow-md font-fraunces">
      {/* Inner container: widen the middle area and center the whole bar */}
      <div className="mx-auto max-w-[1100px] h-16 px-2 flex items-center justify-between">
        {/* LEFT: Back Button */}
        <div className="flex-1 flex">
          <div
            onClick={handleBack}
            className="flex items-center space-x-2 cursor-pointer transition-transform duration-150 hover:-translate-x-0.5 select-none"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 hover:text-black" />
            <span className="text-sm text-gray-700 hover:text-black font-medium">Back</span>
          </div>
        </div>
  
        {/* MID: Tab Navigation (wider + no-wrap) */}
        <nav className="flex-1 flex justify-center">
          <ul className="flex items-center gap-12">
            {tabs.map((tab) => {
              const isAttemptTab = tab.label === 'Attempt Question';
              const hasCount = isAttemptTab && unattemptedQuestionCount > 0;
              const active = selectedTab === tab.label;
  
              return (
                <li
                  key={tab.label}
                  onClick={() => handleTabSelect(tab.label)}
                  className={`relative group cursor-pointer select-none flex items-center gap-2 py-2 px-1 shrink-0
                    transition-transform duration-150 hover:-translate-y-0.5
                    ${isAttemptTab && animateAttemptTab ? 'animate-bounce animate-pulse' : ''}`}
                >
                  <span className="shrink-0">{tab.icon}</span>
  
                  <span className={`whitespace-nowrap ${active ? cfg.tabActive : cfg.tabInactive}`}>
                    {tab.label}
                    {hasCount && (
                      <span className="text-red-600 font-semibold ml-1">({unattemptedQuestionCount})</span>
                    )}
                  </span>
  
                  {/* underline for active tab (just under the label+icon) */}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-black rounded-full" />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
  
        {/* RIGHT: Spacer */}
        <div className="flex-1 pr-[20px]" />
      </div>
    </header>
  );
  
}
