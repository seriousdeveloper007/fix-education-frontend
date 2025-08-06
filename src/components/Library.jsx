import PlatformNavbar from './PlatformNavbar';
import { getTabs } from '../services/tabService';
import { useEffect, useState } from 'react';
import { fetchQuestions } from '../services/questionService';
import { useNavigate } from 'react-router-dom';
import DesktopOnly from './DesktopOnly';
import analytics from '../services/posthogService';


function CompletionCircle({ percent }) {
  const radius = 20; // smaller radius
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percent / 100) * circumference;
  const strokeColor = percent < 50 ? '#ef4444' : '#10b981'; // red / green

  return (
    <div className="flex flex-col items-center justify-center text-sm text-gray-600">
      <svg className="w-14 h-14" viewBox="0 0 60 60">
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="6"
        />
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 30 30)"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="11"
          fill="#111827"
        >
          {percent}%
        </text>
      </svg>
      <div className="text-xs text-center leading-tight mt-1">
        Tutorial<br />Completed
      </div>
    </div>
  );
}

export default function Library() {
  const [tabs, setTabs] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    analytics.libraryPageLoaded();
    async function fetchTabsWithQuestions() {
      const tabData = await getTabs();
      const enrichedTabs = await Promise.all(
        tabData.map(async (tab) => {
          const questionStats = await fetchQuestions(tab.id);
          return {
            ...tab,
            questions: questionStats, // should contain attempted and unattempted
          };
        })
      );
      setTabs(enrichedTabs);
    }

    fetchTabsWithQuestions();
  }, []);

  function getCompletionPercent(tab) {
    const { last_playback_time, video_length } = tab;
    if (!last_playback_time || !video_length || video_length === 0) return 0;
    return Math.min(100, Math.floor((last_playback_time / video_length) * 100));
  }

  const handleThumbnailClick = (tab) => {
    try {
      const baseUrl = tab.captured_from_url;
      const time = tab.last_playback_time || 0;
      const url = new URL(baseUrl);
      url.searchParams.set('t', `${time}s`);
      const encodedUrl = encodeURIComponent(url.toString());
  
      navigate(`/study-room?video=${encodedUrl}&mode=play`);
    } catch (error) {
      console.error("Invalid video URL:", tab.captured_from_url, error);
    }
  };
  

  return (
    <DesktopOnly>
    <div className="font-fraunces bg-white">
      <PlatformNavbar defaultTab="Library" />
      <div className="px-[100px] py-[60px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-10">
          {tabs.map((tab, idx) => {
            const percent = getCompletionPercent(tab);
            const attempted = tab.questions?.attempted?.length || 0;
            const unattempted = tab.questions?.unattempted?.length || 0;

            return (
              <div
                key={idx}
                className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 h-full w-full"
              >
                <img
                  src={tab.thumbnail}
                  alt={tab.page_title}
                  className="w-full h-56 object-cover transition-transform duration-300 ease-in-out transform hover:scale-105 hover:brightness-90 cursor-pointer"
                  onClick={() => handleThumbnailClick(tab)}
                />
                <div className="p-4 flex-grow flex flex-col items-start">
                  <div className="text-[15px] font-medium text-black-500 leading-tight line-clamp-2 h-[3.5em]">
                    {tab.page_title}
                  </div>
                  <div className="mt-4 w-full grid grid-cols-3 gap-2 items-center bg-gray-50 px-4 py-4 rounded-lg shadow-inner group">
                    <CompletionCircle percent={percent} />

                    <div className="flex flex-col items-center justify-center text-sm text-gray-700 col-span-2 relative">
                      <div className="text-base font-bold">
                        {attempted} / {attempted + unattempted}
                      </div>
                      <div className="text-xs text-center">Questions Attempted</div>

                      {/* Hover Button */}
                      <button
                        className="mt-2 px-2 py-[2px] text-[11px] bg-cyan-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => {
                          navigate(`/library/${tab.id}`, {
                            state: {
                              pageTitle: tab.page_title,
                            },
                          });
                        }}
                      >
                        View Questions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </DesktopOnly>
  );
}
