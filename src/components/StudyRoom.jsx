import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createTab } from '../services/tabService';
import { useYouTubePlayer } from './useYouTubePlayer.js';
import PlatformNavbar from './PlatformNavbar';
import StudyRoomNavbar from './StudyRoomNavbar.jsx';
import VideoLinkInputCard from './VideoLinkInputCard.jsx';
import themeConfig from './themeConfig';
import SidePanel from './SidePanel.jsx';
import { fetchUnattemptedQuestions } from '../services/questionService';
import DesktopOnly from './DesktopOnly';
import analytics from '../services/posthogService';
import { API_BASE_URL } from '../config.js';
import LoginCard from './LoginCard';
import { Loader2 } from 'lucide-react';



function extractId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1);
    }
    return u.searchParams.get('v');
  } catch {
    return null;
  }
}

function extractStartTime(url) {
  try {
    const u = new URL(url);
    let t = u.searchParams.get('t');
    if (!t) return 0;

    // Remove trailing 's' if present
    t = t.endsWith('s') ? t.slice(0, -1) : t;

    const seconds = parseInt(t, 10);
    return isNaN(seconds) ? 0 : seconds;
  } catch {
    return 0;
  }
}


export default function StudyRoom() {
  const [params] = useSearchParams();
  const videoUrl = params.get('video') || '';
  const videoId = extractId(videoUrl);
  const mode = params.get('mode');
  const cfg = themeConfig.app;
  const [sidePanelTab, setSidePanelTab] = useState(null);
  const isSidePanelOpen = !!sidePanelTab;
  const startTime = extractStartTime(videoUrl);
  const [unattemptedQuestionCount, setUnattemptedQuestionCount] = useState(0);
  const { iframeRef, pause, getCurrentTime, isPlaying, getDuration } = useYouTubePlayer(videoId);
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const storedTabId = localStorage.getItem('tabId');
  const showIframe = videoId && mode === 'play';
  const [isPreparingRoom, setIsPreparingRoom] = useState(
    showIframe && isLoggedIn && !storedTabId
  );

  useEffect(() => {
    let cancelled = false;

    const attemptCreateTab = async () => {
      const { id: userId } = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      if (!userId || !token) return console.error('Missing user or token');
    
      try {
        const { id } = await createTab(userId, videoUrl, token);
        localStorage.setItem('tabId', id);
        setIsPreparingRoom(false);
      } catch (err) {
        console.error('createTab failed, retrying in 5s', err);
        setTimeout(attemptCreateTab, 5000);
      }
    };

    if (isPreparingRoom) {
      attemptCreateTab();
    }

    return () => {
      cancelled = true;
    };
  }, [isPreparingRoom, isLoggedIn]);


  useEffect(() => {
    if (!showIframe) return;

    const load = async () => {
      const data = await fetchUnattemptedQuestions();
      setUnattemptedQuestionCount(data.length);
    };
    load();
  
    const createQuestions = async () => {
      console.log("create questions")
      const token = localStorage.getItem('token');
      const tabId = localStorage.getItem('tabId');

      if (!token || !tabId) return;

      const playbackTime = getCurrentTime ? Math.floor(getCurrentTime()) : 0;

      if (!isPlaying() || playbackTime <= 60) return;

      console.log(playbackTime)
  
        try {
          const res = await fetch(`${API_BASE_URL}/questions/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            tab_id: tabId,
            playback_time: playbackTime,
          }),
        });
  
        if (!res.ok) return;
        const data = await res.json();
        console.log(data)
        const totalNew = Object.values(data.questions).reduce((sum, arr) => sum + arr.length, 0);
        setUnattemptedQuestionCount((prev) => prev + totalNew);
        console.log(unattemptedQuestionCount)
      } catch (err) {
        console.error('Failed to fetch questions', err);
      }
    };
    createQuestions();
    const interval = setInterval(createQuestions, 100000);
    return () => clearInterval(interval);   

  }, [showIframe]);

  return (
    <DesktopOnly>
    <div className="relative w-full h-full flex flex-col font-fraunces bg-white">
      {!showIframe ? (
        <>
          <PlatformNavbar defaultTab="Study Room" />
          <div className="flex justify-center mt-[100px]">
            <VideoLinkInputCard cfg={cfg} initialUrl={videoUrl} />
          </div>
        </>
      ) : (
        <>
            <StudyRoomNavbar videoUrl={videoUrl}
              onTabSelect={(tab) => {
              pause(); // 👈 Pause video before opening side panel
              setSidePanelTab(tab);
              analytics.sideNavbarOpened(tab);
            }}
              unattemptedQuestionCount={unattemptedQuestionCount}
              getCurrentTime={getCurrentTime}
              getDuration={getDuration}
              selectedTab={sidePanelTab}/>
          <div className="flex flex-1 overflow-hidden"> {/* Main row: video + side panel */}
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&start=${startTime}`}
              title="YouTube video"
              className={`${isSidePanelOpen ? 'w-2/3' : 'w-full'} h-full`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {isSidePanelOpen && (
              <SidePanel
                tab={sidePanelTab}
                onClose={() => setSidePanelTab(null)}
                getCurrentTime={getCurrentTime}
                updateQuestionCount={(delta) => {
                  setUnattemptedQuestionCount((prev) => Math.max(0, prev + delta));
                }}
              />
            )}
          </div>
        </>
      )}
      {!isLoggedIn && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center">
          <LoginCard redirectUri={window.location.href} />
        </div>
      )}

       {/* preparing-room loader overlay */}
       {isLoggedIn && isPreparingRoom && (
          <div className="absolute inset-0 z-50 bg-black/40 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin h-12 w-12 text-white" />
            <p className="text-white text-lg">Preparing study room…</p>
          </div>
        )}
    </div>
    </DesktopOnly>
  );
}
