import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';
import { useResponsive } from '../hooks/useResponsive';
import { useStudyRoomInit } from '../hooks/useStudyRoomInit';
import { useQuestionManagement } from '../hooks/useQuestionManagement';
import { useVideoChunks } from '../hooks/useVideoChunks';
import { usePlaybackTracking } from '../hooks/usePlaybackTracking';
import { DesktopLayout } from '../components/studyroom/layouts/DesktopLayout';
import { MobileLayout } from '../components/studyroom/layouts/MobileLayout';
import PlatformNavbar from '../components/PlatformNavbar';
import VideoLinkInputCard from '../components/studyroom/VideoLinkInputCard';
import LoginCard from '../components/LoginCard';
import { Loader2 } from 'lucide-react';
import { updateTab } from '../services/tabService';
import themeConfig from '../config/themeConfig';

// Utility functions
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
  
  // Responsive detection
  const { isMobile, isDesktop } = useResponsive();
  
  // Auth & display state
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const showIframe = videoId && mode === 'play';
  
  // Video timing
  const urlStartTime = extractStartTime(videoUrl);
  const savedStartTime = videoId ? parseInt(localStorage.getItem(`playbackTime_${videoId}`) || '0', 10) : 0;
  const startTime = savedStartTime > 0 ? savedStartTime : urlStartTime;
  
  // Player state change handler
  const handlePlayerStateChange = useCallback((state) => {
    console.log('Player state changed to:', state);
    if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.PAUSED) {
      const last_playback_time = Math.floor(getCurrentTime() || 0);
      const video_length = getDuration() || 0;
      updateTab(last_playback_time, video_length).catch(console.error);
    }
  }, []);
  
  // YouTube player
  const { iframeRef, pause, getCurrentTime, isPlaying, getDuration } = useYouTubePlayer(
    videoId, 
    handlePlayerStateChange
  );
  
  // Initialize study room
  const { isPreparingRoom } = useStudyRoomInit({
    showIframe,
    isLoggedIn,
    videoUrl,
    startTime
  });
  
  // Question management
  const { unattemptedQuestionCount, updateQuestionCount } = useQuestionManagement({
    showIframe,
    isPreparingRoom,
    isPlaying,
    getCurrentTime
  });
  
  // Video chunks
  useVideoChunks({
    showIframe,
    getCurrentTime,
    isPreparingRoom,
    isPlaying
  });
  
  // Playback tracking
  usePlaybackTracking({
    showIframe,
    getCurrentTime,
    videoId,
    isPreparingRoom
  });
  
  // Render video input screen
  if (!showIframe) {
    return (
      <div className="relative w-full h-screen flex flex-col font-fraunces bg-white overflow-hidden">
        <PlatformNavbar defaultTab="Study Room" />
        <div className={`flex justify-center ${isMobile ? 'mt-8 px-4' : 'mt-[100px]'}`}>
          <VideoLinkInputCard cfg={cfg} initialUrl={videoUrl} />
        </div>
        {!isLoggedIn && (
          <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <LoginCard redirectUri={window.location.href} />
          </div>
        )}
      </div>
    );
  }
  
  // Render study room with responsive layout
  return (
    <div className="relative w-full h-screen flex flex-col font-fraunces bg-white overflow-hidden">
      {isMobile ? (
        <MobileLayout
          videoId={videoId}
          startTime={startTime}
          iframeRef={iframeRef}
          getCurrentTime={getCurrentTime}
          unattemptedQuestionCount={unattemptedQuestionCount}
          updateQuestionCount={updateQuestionCount}
        />
      ) : (
        <DesktopLayout
          videoUrl={videoUrl}
          videoId={videoId}
          startTime={startTime}
          iframeRef={iframeRef}
          pause={pause}
          getCurrentTime={getCurrentTime}
          getDuration={getDuration}
          unattemptedQuestionCount={unattemptedQuestionCount}
          updateQuestionCount={updateQuestionCount}
        />
      )}
      
      {/* Login overlay */}
      {!isLoggedIn && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center">
          <LoginCard redirectUri={window.location.href} />
        </div>
      )}
      
      {/* Loading overlay */}
      {isLoggedIn && isPreparingRoom && (
        <div className="absolute inset-0 z-50 bg-black/40 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin h-12 w-12 text-white" />
          <p className="text-white text-lg">Preparing study room…</p>
        </div>
      )}
    </div>
  );
}