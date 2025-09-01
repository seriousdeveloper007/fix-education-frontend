import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { createTab, updateTab } from '../../services/tabService.js';
import { useYouTubePlayer } from '../../hooks/useYouTubePlayer.js';
import PlatformNavbar from '../../components/PlatformNavbar.jsx';
import VideoLinkInputCard from '../../components/studyroom/VideoLinkInputCard.jsx';
import themeConfig from '../themeConfig.js';
import { fetchUnattemptedQuestions, createQuestions } from '../../services/questionService.js';
import analytics from '../../services/posthogService.js';
import LoginCard from '../../components/LoginCard.jsx';
import { Loader2, ChevronUp, ChevronDown, MessageSquare, PencilLine, Code } from 'lucide-react';
import { createVideoChunk } from '../../services/videoChunkService.js';
import ChatView from '../../components/studyroom/ChatView.jsx';
import QuestionView from '../../components/studyroom/QuestionView.jsx';
import TasksView from '../../components/studyroom/TasksView.jsx';

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

export default function StudyRoomMobile() {
  const [params] = useSearchParams();
  const videoUrl = params.get('video') || '';
  const videoId = extractId(videoUrl);
  const mode = params.get('mode');
  const cfg = themeConfig.app;
  
  // Video state
  const urlStartTime = extractStartTime(videoUrl);
  const savedStartTime = videoId ? parseInt(localStorage.getItem(`playbackTime_${videoId}`) || '0', 10) : 0;
  const startTime = savedStartTime > 0 ? savedStartTime : urlStartTime;
  const showIframe = videoId && mode === 'play';
  
  // UI state
  const [isVideoCollapsed, setIsVideoCollapsed] = useState(false);
  const [activeFeature, setActiveFeature] = useState('Ask Doubt');
  
  // App state
  const [unattemptedQuestionCount, setUnattemptedQuestionCount] = useState(0);
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const [isPreparingRoom, setIsPreparingRoom] = useState(showIframe && isLoggedIn);
 

  // Video player hook
  const handlePlayerStateChange = useCallback((state) => {
    console.log('Player state changed to:', state);
    if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.PAUSED) {
      const last_playback_time = Math.floor(getCurrentTime() || 0);
      const video_length = getDuration() || 0;
      updateTab(last_playback_time, video_length).catch(console.error);
    }
  }, []);

  const { iframeRef, pause, getCurrentTime, isPlaying, getDuration } = useYouTubePlayer(
    videoId, 
    handlePlayerStateChange
  );

  // Keyboard detection for auto-collapse
  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const screenHeight = window.screen.height;
      const keyboardOpen = viewportHeight < screenHeight * 0.75;
      
      if (keyboardOpen && !isVideoCollapsed) {
        setIsVideoCollapsed(true);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport.removeEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isVideoCollapsed]);

  // Initialize study room
  useEffect(() => {
    if (!showIframe || !isLoggedIn) return;

    localStorage.removeItem('tabId');
    localStorage.removeItem('chatId');
    Object.keys(localStorage)
      .filter((key) => key.startsWith('noteId'))
      .forEach((key) => localStorage.removeItem(key));

    const { id: userId } = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    if (!userId || !token) return;

    const attemptCreateTab = async () => {
      try {
        setIsPreparingRoom(true);
        const { id } = await createTab(userId, videoUrl, token);
        localStorage.setItem('tabId', id);
        analytics.youtubeLearningStarted(videoUrl);
        setIsPreparingRoom(false);
        setTimeout(() => createVideoChunk(Math.floor(startTime || 0)).catch(console.error), 0);
      } catch (err) {
        console.error('createTab failed, retrying in 5s', err);
        setTimeout(attemptCreateTab, 5000);
      }
    };

    attemptCreateTab();
  }, [showIframe, isLoggedIn, videoUrl, startTime]);

  // Question management
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

      const { totalNew } = await createQuestions(tabId, playbackTime);
      if (totalNew > 0) {
        setUnattemptedQuestionCount((prev) => prev + totalNew);
      }
    };

    const intervalId = setInterval(tickCreateQuestions, 20000);
    return () => clearInterval(intervalId);
  }, [showIframe, isPreparingRoom, isPlaying, getCurrentTime]);

  // Video chunk creation
  useEffect(() => {
    if (!showIframe || !getCurrentTime || isPreparingRoom) return;

    const tickCreateChunk = async () => {
      if (!isPlaying()) return;
      try {
        const playbackTime = Math.floor(getCurrentTime());
        await createVideoChunk(playbackTime);
      } catch (err) {
        console.error('createVideoChunk failed:', err);
      }
    };

    tickCreateChunk();
    const intervalId = setInterval(tickCreateChunk, 20000);
    return () => clearInterval(intervalId);
  }, [showIframe, getCurrentTime, isPreparingRoom, isPlaying]);

  // Save playback time
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

  // Auto-set default feature when entering study room
  useEffect(() => {
    if (showIframe) {
      setActiveFeature('Ask Doubt');
    }
  }, [showIframe]);

  const featureButtons = [
    { 
      id: 'Ask Doubt', 
      label: 'Ask Doubt', 
      icon: MessageSquare,
      count: null 
    },
    { 
      id: 'Attempt Question', 
      label: 'Quiz', 
      icon: PencilLine,
      count: unattemptedQuestionCount > 0 ? unattemptedQuestionCount : null
    },
    { 
      id: 'Code from Video', 
      label: 'Code', 
      icon: Code,
      count: null 
    },
  ];

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'Ask Doubt':
        return <ChatView getCurrentTime={getCurrentTime} />;
      case 'Attempt Question':
        return (
          <QuestionView 
            updateQuestionCount={(delta) => {
              setUnattemptedQuestionCount((prev) => Math.max(0, prev + delta));
            }} 
          />
        );
      case 'Code from Video':
        return <TasksView />;
      default:
        return null;
    }
  };

  if (!showIframe) {
    return (
      <div className="relative w-full h-screen flex flex-col font-fraunces bg-white overflow-hidden">
        <PlatformNavbar defaultTab="Study Room" />
        <div className="flex justify-center mt-8 px-4">
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

  return (
    <div className="relative w-full h-screen flex flex-col font-fraunces bg-white">
      {/* Platform Navbar */}
      <div className="flex-shrink-0">
      <PlatformNavbar defaultTab="Study Room" />
    </div>
      
     
{/* Video Section */}

<div className="flex-shrink-0">
<div className={`relative bg-black transition-all duration-300 ${isVideoCollapsed ? 'h-0' : 'h-[50vh]'} overflow-hidden`}>
  {!isVideoCollapsed && (
    <iframe
      ref={iframeRef}
      src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&start=${startTime}`}
      title="YouTube video"
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )}
  </div>
  
  {/* Video Collapse Button - Always visible */}
  <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
  <span className="text-xs text-gray-600">
    Switch to desktop for best learning experience.
  </span>
  <button
    onClick={() => setIsVideoCollapsed(!isVideoCollapsed)}
    className="flex items-center gap-1 text-xs text-gray-700 hover:text-black transition-colors"
  >
    {isVideoCollapsed ? 'Show Video' : 'Hide Video'}
    {isVideoCollapsed ? ( <ChevronUp className="w-4 h-4" />) : (<ChevronDown className="w-4 h-4" />)}
  </button>
</div>
</div> 



<div className="flex-shrink-0 bg-gray-50 border-b border-gray-200">
      {/* Feature Buttons */}
      <div className="flex bg-gray-50 border-b border-gray-200">
        {featureButtons.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeFeature === feature.id;
          
          return (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors min-h-[60px] ${
                isActive 
                  ? 'bg-white border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center relative">
                <Icon className="w-5 h-5" />
                {feature.count && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {feature.count}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{feature.label}</span>
            </button>
          );
        })}
        </div>
      </div>

      {/* Feature Content Area */}
      <div className="flex-1 overflow-hidden bg-white">
        {renderFeatureContent()}
      </div>

      {/* Login overlay */}
      {!isLoggedIn && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <LoginCard redirectUri={window.location.href} />
        </div>
      )}

      {/* Loading overlay */}
      {isLoggedIn && isPreparingRoom && (
        <div className="absolute inset-0 z-50 bg-black/40 flex flex-col items-center justify-center space-y-4 p-4">
          <Loader2 className="animate-spin h-8 w-8 text-white" />
          <p className="text-white text-base text-center">Preparing study room…</p>
        </div>
      )}
    </div>
  );
}