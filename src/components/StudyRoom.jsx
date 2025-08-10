import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { createTab } from '../services/tabService';
import { useYouTubePlayer } from './useYouTubePlayer.js';
import PlatformNavbar from './PlatformNavbar';
import StudyRoomNavbar from './StudyRoomNavbar.jsx';
import VideoLinkInputCard from './VideoLinkInputCard.jsx';
import themeConfig from './themeConfig';
import SidePanel from './SidePanel.jsx';
import { fetchUnattemptedQuestions, createQuestions } from '../services/questionService';
import DesktopOnly from './DesktopOnly';
import analytics from '../services/posthogService';
import LoginCard from './LoginCard';
import { Loader2 } from 'lucide-react';
import { createVideoChunk } from '../services/videoChunkService';




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
  const [lastQuestionCreated, setLastQuestionCreated] = useState(0)
  const lastCreatedRef = useRef(0);
  useEffect(() => { lastCreatedRef.current = lastQuestionCreated; }, [lastQuestionCreated]);


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
  
    // initial load
    (async () => {
      const data = await fetchUnattemptedQuestions();
      setUnattemptedQuestionCount(data.length);
    })();
  
    const tickCreateQuestions = async () => {
      if (!isPlaying || !isPlaying()) return;
  
      const tabId = localStorage.getItem('tabId');
      if (!tabId || !getCurrentTime) return;
  
      const playbackTime = Math.floor(getCurrentTime());
      if (playbackTime <= 60) return;
      const diff = playbackTime - (lastCreatedRef.current || 0);
      if (diff < 180) return;

  
      const { totalNew } = await createQuestions(tabId, playbackTime);
      if (totalNew > 0) {
        setUnattemptedQuestionCount((prev) => prev + totalNew);
        setLastQuestionCreated(playbackTime);
      }
    };
  
    const intervalId = setInterval(tickCreateQuestions, 20000);
  
    return () => {
      clearInterval(intervalId);
    };
  }, [showIframe]);
  


  // call create video chunk every 10s with playback_time and (playback_time + 180) as duration
  useEffect(() => {
    console.log("create chunk")
    if (!showIframe) return;

    let intervalId;

    const tickCreateChunk = async () => {

      const playbackTime = Math.floor(getCurrentTime());
      let playback_time = playbackTime + 180
      try {
        await createVideoChunk(playback_time); // assuming service accepts the payload object
      } catch (err) {
        console.error('createVideoChunk failed:', err);
      }
    };

    tickCreateChunk()

    intervalId = setInterval(tickCreateChunk, 150000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  
  

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
