import themeConfig from './themeConfig';
import { ArrowLeft } from 'lucide-react';
import { updateTab } from '../services/tabService';



export default function StudyRoomNavbar({ videoUrl, onTabSelect, selectedTab, getCurrentTime, getDuration, unattemptedQuestionCount }) {
  const cfg = themeConfig.app;

  const tabs = [
    { label: 'Ask Doubt', emoji: '❓' },
    { label: 'Attempt Question', emoji: '📝' },
    { label: 'Take Notes', emoji: '✍️' },
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
    <header className={`sticky top-0 z-50 w-full h-16 px-6 flex items-center justify-between shadow-md ${cfg.appHeader} font-fraunces`}>
      <div className="w-[100px] flex items-center pl-[30px]">
        <ArrowLeft size={24} className="cursor-pointer hover:opacity-70" onClick={handleBack} />
      </div>

      <div className="flex-1 flex justify-center items-center space-x-12">
      {tabs.map((tab) => {
        const isAttemptTab = tab.label === 'Attempt Question';
        const displayLabel = isAttemptTab && unattemptedQuestionCount > 0
          ? `${tab.label} (${unattemptedQuestionCount})`
          : tab.label;

        return (
          <div
            key={tab.label}
            onClick={() => onTabSelect(tab.label)}
            className="flex flex-col items-center group cursor-pointer whitespace-nowrap"
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{tab.emoji}</span>
              <span className={selectedTab === tab.label ? cfg.tabActive : cfg.tabInactive}>
                {displayLabel}
              </span>
            </div>
            {selectedTab === tab.label && (
              <div className="mt-1 w-full h-[3px] bg-black rounded-full" />
            )}
          </div>
        );
      })}

      </div>

      <div className="w-[100px]" />
    </header>
  );
}
