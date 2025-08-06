import themeConfig from './themeConfig';
import { updateTab } from '../services/tabService';
import { ArrowLeft, MessageSquare, PencilLine } from 'lucide-react';


export default function StudyRoomNavbar({
  videoUrl,
  onTabSelect,
  selectedTab,
  getCurrentTime,
  getDuration,
  unattemptedQuestionCount,
}) {
  const cfg = themeConfig.app;

  const tabs = [
    { label: 'Ask Doubt', icon: <MessageSquare className="w-5 h-5 text-indigo-600 group-hover:text-indigo-800" /> },
    { label: 'Attempt Question', icon: <PencilLine className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800" /> },
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
    <header className={`sticky top-0 z-50 w-full h-16 px-6 flex items-center justify-between shadow-md bg-white/40 backdrop-blur-lg font-fraunces`}>
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
          const displayLabel =
            isAttemptTab && unattemptedQuestionCount > 0
              ? `${tab.label} (${unattemptedQuestionCount})`
              : tab.label;

          return (
            <div
              key={tab.label}
              onClick={() => onTabSelect(tab.label)}
              className="flex flex-col items-center group cursor-pointer transition-transform duration-150 hover:-translate-y-0.5"
            >
              <div className="flex items-center space-x-2">
                {tab.icon}
                <span className={selectedTab === tab.label ? cfg.tabActive : cfg.tabInactive}>
                  {displayLabel}
                </span>
              </div>
              {selectedTab === tab.label && (
                <div className="mt-1 w-full h-[3px] bg-black rounded-full transition-all duration-200" />
              )}
            </div>
          );
        })}
      </div>

      {/* RIGHT: Spacer for symmetry */}
      <div className="flex-1 pr-[50px]" />
    </header>
  );
}
