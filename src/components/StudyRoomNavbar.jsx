import themeConfig from './themeConfig';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function StudyRoomNavbar({ videoUrl, onTabSelect, selectedTab }) {
  const cfg = themeConfig.app;
  const navigate = useNavigate();

  const tabs = [
    { label: 'Ask Doubt', emoji: '❓' },
    { label: 'Attempt Question', emoji: '📝' },
    { label: 'Take Notes', emoji: '✍️' },
  ];

  const handleBack = () => {
    // Go to input mode with video prefilled
    navigate(`/study-room?video=${encodeURIComponent(videoUrl)}`);
  };

  return (
    <header className={`sticky top-0 z-50 w-full h-16 px-6 flex items-center justify-between shadow-md ${cfg.appHeader} font-fraunces`}>
      <div className="w-[100px] flex items-center pl-[30px]">
        <ArrowLeft size={24} className="cursor-pointer hover:opacity-70" onClick={handleBack} />
      </div>

      <div className="flex-1 flex justify-center items-center space-x-12">
        {tabs.map((tab) => (
          <div
            key={tab.label}
            onClick={() => onTabSelect(tab.label)}
            className="flex flex-col items-center group cursor-pointer whitespace-nowrap"
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{tab.emoji}</span>
              <span className={selectedTab === tab.label ? cfg.tabActive : cfg.tabInactive}>
                {tab.label}
              </span>
            </div>
            {selectedTab === tab.label && (
              <div className="mt-1 w-full h-[3px] bg-black rounded-full" />
            )}
          </div>
        ))}
      </div>

      <div className="w-[100px]" />
    </header>
  );
}
