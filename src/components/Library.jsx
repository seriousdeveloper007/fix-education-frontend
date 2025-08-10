import PlatformNavbar from './PlatformNavbar';
import { getTabs } from '../services/tabService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopOnly from './DesktopOnly';
import analytics from '../services/posthogService';
import { Loader2 } from 'lucide-react';



function CompletionCircle({ percent, onClick }) {
  const radius = 20; // smaller radius
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percent / 100) * circumference;
  const strokeColor = percent < 50 ? '#ef4444' : '#10b981'; // red / green

  return (
    <div
      className="flex flex-col items-center justify-center text-sm text-gray-600 cursor-pointer"
      onClick={onClick}
    >
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    analytics.libraryPageLoaded();
    async function fetchTabsWithQuestions() {
      try {
        const tabData = await getTabs();
        setTabs(tabData);
      } finally {
        setLoading(false);
      }
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
      localStorage.setItem('tabId', tab.id);
    } catch (error) {
      console.error("Invalid video URL:", tab.captured_from_url, error);
    }
  };

  return (
    <DesktopOnly>
      <div className="font-fraunces bg-white">
        <PlatformNavbar defaultTab="Library" />
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
            <Loader2 className="w-12 h-12 text-cyan-700 animate-spin" />
            <p className="text-gray-600 text-lg">Synchronizing your Library records…</p>
          </div>
        ) : tabs.length === 0 ? (
          <div className="flex items-center justify-center h-[80vh] px-4">
            <p className="text-center text-gray-500 text-lg">
              Your Library is empty. Watch a video in the Study Room and your viewing history will appear here for easy revisits.
            </p>
          </div>
        ) : (
          <div className="px-[100px] py-[60px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-10">
              {tabs.map((tab, idx) => {
                const percent = getCompletionPercent(tab);
                const attempted = tab.attempted_questions || 0;
                const unattempted = tab.unattempted_questions || 0;

                return (
                  <div
                    key={idx}
                    className="flex flex-col bg-white/40 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg overflow-hidden h-full w-full transition-transform hover:-translate-y-1 hover:shadow-xl group"
                  >
                    <img
                      src={tab.thumbnail}
                      alt={tab.page_title}
                      className="w-full h-56 object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105 group-hover:brightness-90 cursor-pointer"
                      onClick={() => handleThumbnailClick(tab)}
                    />
                    <div className="p-4 flex-grow flex flex-col items-start">
                      <div
                        className="text-[15px] font-medium text-black-500 leading-tight line-clamp-2 h-[3.5em] group-hover:text-cyan-700 transition-colors duration-300 cursor-pointer"
                        onClick={() => handleThumbnailClick(tab)}
                      >
                        {tab.page_title}
                      </div>

                      <div className="mt-4 w-full grid grid-cols-3 gap-2 items-center bg-gray-50/70 backdrop-blur-sm px-4 py-4 rounded-lg shadow-inner relative group/stats">
                        <CompletionCircle
                          percent={percent}
                          onClick={() => handleThumbnailClick(tab)}
                        />

                        <div className="flex flex-col items-center justify-center text-sm text-gray-700 col-span-2">
                          <div className="text-base font-bold">
                            {attempted} / {attempted + unattempted}
                          </div>
                          <div className="text-xs text-center">Questions Attempted</div>

                          <button
                            className="mt-2 px-3 py-1 text-xs bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] hover:from-[#0369a1] hover:to-[#06b6d4] text-white font-medium rounded-lg shadow transition-transform hover:-translate-y-0.5 opacity-0 group-hover/stats:opacity-100 pointer-events-auto"
                            onClick={() => {
                              navigate(`/library/${tab.id}`, {
                                state: { pageTitle: tab.page_title },
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
        )}
      </div>
    </DesktopOnly>
  );
}
