import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { createTab , updateTab} from '../services/tabService';
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
  const urlStartTime = extractStartTime(videoUrl);
  const savedStartTime = videoId ? parseInt(localStorage.getItem(`playbackTime_${videoId}`) || '0', 10) : 0;
  const startTime = savedStartTime > 0 ? savedStartTime : urlStartTime;
  const [unattemptedQuestionCount, setUnattemptedQuestionCount] = useState(0);
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const showIframe = videoId && mode === 'play';
  const [isPreparingRoom, setIsPreparingRoom] = useState(showIframe && isLoggedIn);

  const handleUpdateTabDetails = useCallback(async (getCurrentTime, getDuration) => {
    if (!getCurrentTime || !getDuration) return;
    
    console.log("Updating tab details from video state change...");
    const last_playback_time = Math.floor(getCurrentTime() || 0);
    const video_length = getDuration() || 0;
    
    try {
      await updateTab(last_playback_time, video_length);
    } catch (error) {
      console.error('Failed to update tab details:', error);
    }
  }, []);

  // Handle YouTube player state changes (play/pause)
  const handlePlayerStateChange = useCallback((state) => {
    console.log('Player state changed to:', state);
    
    // Update tab details on play (1) or pause (2) events
    if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.PAUSED) {
      handleUpdateTabDetails(getCurrentTime, getDuration);
    }
  }, [handleUpdateTabDetails]);

  const { iframeRef, pause, getCurrentTime, isPlaying, getDuration } = useYouTubePlayer(
    videoId, 
    handlePlayerStateChange
  );


  useEffect(() => {
    if (!showIframe || !isLoggedIn) return;

    localStorage.removeItem('tabId');
    localStorage.removeItem('chatId');
    Object.keys(localStorage)
      .filter((key) => key.startsWith('noteId'))
      .forEach((key) => localStorage.removeItem(key));

    const { id: userId } = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      console.error('Missing user or token');
      return;
    }

    const attemptCreateTab = async () => {
      try {
        const { id } = await createTab(userId, videoUrl, token);
        localStorage.setItem('tabId', id);
        localStorage.removeItem('chatId');
        analytics.youtubeLearningStarted(videoUrl);
        setIsPreparingRoom(false);
      } catch (err) {
        console.error('createTab failed, retrying in 5s', err);
        setTimeout(attemptCreateTab, 5000);
      }
    };

    attemptCreateTab();
  }, [showIframe, isLoggedIn, videoUrl]);

  useEffect(() => {
    if (!showIframe || isPreparingRoom) return;

    (async () => {
      const data = await fetchUnattemptedQuestions();
      setUnattemptedQuestionCount(data.length);
    })();

    const tickCreateQuestions = async () => {
      if (!isPlaying()) return;

      const tabId = localStorage.getItem('tabId');
      if (!tabId || !getCurrentTime) return;

      const playbackTime = Math.floor(getCurrentTime());
      if (playbackTime <= 60) return;

      console.log("creating question", playbackTime)

      const { totalNew } = await createQuestions(tabId, playbackTime);
      if (totalNew > 0) {
        setUnattemptedQuestionCount((prev) => prev + totalNew);
      }
    };

    const intervalId = setInterval(tickCreateQuestions, 20000);

    return () => {
      clearInterval(intervalId);
    };
  }, [showIframe, isPreparingRoom]);


  useEffect(() => {
    console.log("inside create chunk")
    if (!showIframe || !getCurrentTime || isPreparingRoom) return;

    const tickCreateChunk = async () => {
      if (!isPlaying()) return;
      try {
        const playbackTime = Math.floor(getCurrentTime());
        console.log("Creating video chunk for time:", playbackTime);
        await createVideoChunk(playbackTime);
      } catch (err) {
        console.error('createVideoChunk failed:', err);
      }
    };

    // Call immediately
    tickCreateChunk();

    // Set up interval
    const intervalId = setInterval(tickCreateChunk, 20000);

    return () => clearInterval(intervalId);
  }, [showIframe, getCurrentTime, isPreparingRoom]); // ✅ Include dependencies


  // Save playback time every 2 seconds
  useEffect(() => {
    if (!showIframe || !getCurrentTime || !videoId || isPreparingRoom) return;

    const savePlaybackTime = () => {
      try {
        const currentTime = Math.floor(getCurrentTime());
        if (currentTime > 0) {
          localStorage.setItem(`playbackTime_${videoId}`, currentTime.toString());
        }
      } catch (error) {
        console.error('Failed to save playback time:', error);
      }
    };

    const intervalId = setInterval(savePlaybackTime, 2000);

    return () => clearInterval(intervalId);
  }, [showIframe, getCurrentTime, videoId, isPreparingRoom]);
  

  return (
    <DesktopOnly>
    <div className="relative w-full h-screen flex flex-col font-fraunces bg-white overflow-hidden">
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
