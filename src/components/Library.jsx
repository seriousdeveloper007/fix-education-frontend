import PlatformNavbar from './PlatformNavbar';
import { getTabs } from '../services/tabService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveWrapper from './ResponsiveWrapper';
import analytics from '../services/posthogService';
import { cleanupOrphanedNoteIds } from '../utils/storage';
import { Loader2, Notebook, BookCheck } from 'lucide-react';

function CompletionCircle({ percent, onClick }) {
  const radius = 16; // smaller radius
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percent / 100) * circumference;
  const strokeColor = percent < 50 ? '#ef4444' : '#10b981'; // red / green

  return (
    <div
      className="flex flex-col items-center justify-center text-sm text-gray-700 cursor-pointer"
      onClick={onClick}
    >

      <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="9"
          fill="#111827"
          className="sm:text-[10px] md:text-[11px]"
        >
          {percent}%
        </text>
      </svg>
      <div className="text-[10px] sm:text-xs text-center leading-tight mt-1">
        Tutorial<br />Completed
      </div>
      <div className="text-[8px] sm:text-[10px] text-gray-400 mt-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
        View
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

        // Clean up orphaned note IDs for tabs that no longer exist
        const validTabIds = tabData.map(tab => tab.id.toString());
        cleanupOrphanedNoteIds(validTabIds);

      } catch (error) {
        console.error('Failed to fetch tabs:', error);
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
    } catch (error) {
      console.error("Invalid video URL:", tab.captured_from_url, error);
    }
  };

  return (
    <ResponsiveWrapper>
      <div className="font-fraunces bg-white min-h-screen">
        <PlatformNavbar defaultTab="Library" />
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[80vh] space-y-4 px-4">
            <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-cyan-700 animate-spin" />


            <p className="text-gray-600 text-base sm:text-lg text-center">
              Synchronizing your Library records…</p>
          </div>
        ) : tabs.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh] px-4">

            <p className="text-center text-gray-500 text-base sm:text-lg max-w-md">
              Your Library is empty. Watch a video in the Study Room and your viewing history will appear here for easy revisits.
            </p>
          </div>
        ) : (
          <div className="px-4 py-8 sm:px-8 sm:py-12 md:px-16 md:py-16 lg:px-[100px] lg:py-[60px]">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {tabs.map((tab, idx) => {
                const percent = getCompletionPercent(tab);
                const attempted = tab.attempted_questions || 0;
                const unattempted = tab.unattempted_questions || 0;

                return (
                  <div
                    key={tab.id || idx} // Use tab.id as key for better React reconciliation
                    className="flex flex-col bg-white/40 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg overflow-hidden h-full w-full transition-transform hover:-translate-y-1 hover:shadow-xl group"
                  >
                    <img
                      src={tab.thumbnail}
                      alt={tab.page_title}


                      className="w-full h-40 sm:h-48 md:h-56 object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105 group-hover:brightness-90 cursor-pointer"
                      onClick={() => handleThumbnailClick(tab)}
                    />
                    <div className="p-3 sm:p-4 flex-grow flex flex-col items-start">


                      <div className="text-sm sm:text-[15px] font-medium text-black-500 leading-tight line-clamp-2 h-[2.5em] sm:h-[3.5em] group-hover:text-cyan-700 transition-colors duration-300 cursor-pointer mb-3"
                        onClick={() => handleThumbnailClick(tab)}
                      >
                        {tab.page_title}
                      </div>

                      <div className="mt-auto w-full">
                      <div className="bg-gray-50/70 backdrop-blur-sm px-3 py-3 sm:px-4 sm:py-4 rounded-lg shadow-inner">
                      <div className="grid grid-cols-2 gap-4 items-center">
                            <CompletionCircle
                              percent={percent}
                              onClick={() => handleThumbnailClick(tab)}
                            />

                            <div
                              className="flex flex-col items-center justify-center text-sm text-gray-700 cursor-pointer"
                              onClick={() => {
                                navigate(`/library/${tab.id}?view=questions`, {
                                  state: { pageTitle: tab.page_title },
                                });
                              }}
                            >
                              <BookCheck className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-gray-500" strokeWidth={1} />

                              <div className="text-[10px] sm:text-xs text-center mt-1">Quiz Results</div>

                              <div className="text-[10px] sm:text-xs font-small mt-1">
                                {attempted} / {attempted + unattempted}
                              </div>

                              <div className="text-[8px] sm:text-[10px] text-gray-400 mt-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">View</div>
                            </div>
                          </div>
                        </div>

                        {/* <div
                          className="flex flex-col items-center justify-center text-sm text-gray-700 cursor-pointer"
                          onClick={() => {
                            navigate(`/library/${tab.id}?view=notes`, {
                              state: { pageTitle: tab.page_title },
                            });
                          }}
                        >
                          <Notebook className="w-14 h-14 text-gray-500" strokeWidth={1} />
                          <div className="text-xs text-center mt-1">Saved <br/> Notes</div>
                          <div className="text-[10px] text-gray-400 mt-1 text-center">View</div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ResponsiveWrapper>
  );
}