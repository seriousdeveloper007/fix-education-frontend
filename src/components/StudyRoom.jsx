import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useYouTubePlayer } from './useYouTubePlayer.js';
import PlatformNavbar from './PlatformNavbar';
import StudyRoomNavbar from './StudyRoomNavbar.jsx';
import VideoLinkInputCard from './VideoLinkInputCard.jsx';
import themeConfig from './themeConfig';
import SidePanel from './SidePanel.jsx';
import { QuestionsProvider, useQuestions } from './QuestionContext.jsx';

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

function StudyRoomInner() {
  const [params] = useSearchParams();
  const videoUrl = params.get('video') || '';
  const videoId = extractId(videoUrl);
  const mode = params.get('mode');
  const cfg = themeConfig.app;
  const [sidePanelTab, setSidePanelTab] = useState(null);
  const isSidePanelOpen = !!sidePanelTab;
  const { setQuestions } = useQuestions();

  const { iframeRef, pause, getCurrentTime } = useYouTubePlayer(videoId);

  useEffect(() => {
    if (mode !== 'true') return;

    const fetchQuestions = async () => {
      const token = localStorage.getItem('token');
      const tabId = localStorage.getItem('tabId');
      if (!token || !tabId) return;
      try {
        const res = await fetch('http://localhost:8000/questions/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({ tab_id: tabId }),
        });
        if (!res.ok) return;
        const data = await res.json();
        const q = data.questions || {};
        setQuestions({
          mcq: q.mcq_questions || [],
          fill: q.fill_in_the_blanks || [],
          subjective: q.subjective_questions || [],
        });
      } catch (err) {
        console.error('Failed to fetch questions', err);
      }
    };

    fetchQuestions();
    const interval = setInterval(fetchQuestions, 30000);
    return () => clearInterval(interval);
  }, [mode, setQuestions]);

  const showIframe = videoId && mode === 'play';

  return (
    <div className="w-full h-full flex flex-col font-fraunces">
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
            }}
            selectedTab={sidePanelTab}/>
          <div className="flex flex-1 overflow-hidden"> {/* Main row: video + side panel */}
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
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
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function StudyRoom() {
  return (
    <QuestionsProvider>
      <StudyRoomInner />
    </QuestionsProvider>
  );
}
