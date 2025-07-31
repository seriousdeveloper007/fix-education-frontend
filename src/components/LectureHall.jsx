import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { HelpCircle, PencilLine, ClipboardList, ArrowLeft } from 'lucide-react';
import themeConfig from './themeConfig';
import { useAudioRecorder } from './AudioRecorderContext.jsx';

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

export default function LectureHall({ theme }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const videoUrl = params.get('video');
  const videoId = extractId(videoUrl);
  const cfg = themeConfig[theme];
  const { stop } = useAudioRecorder();
  const [activePanel, setActivePanel] = useState(null);
  const iframeRef = useRef(null);

  const pauseVideo = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      );
    }
  };

  const openPanel = (panel) => {
    pauseVideo();
    setActivePanel(panel);
  };

  const closePanel = () => setActivePanel(null);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const handleBack = () => {
    navigate('/workspace');
  };

  return (
    <div className="p-6">
      <button
        onClick={handleBack}
        className={`flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${cfg.secondaryBtn}`}
      >
        <ArrowLeft size={18} /> Back
      </button>
      {videoId ? (
        <>
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-lg aspect-video">
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
              title="YouTube video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => openPanel('doubt')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${cfg.primaryBtn}`}
            >
              <HelpCircle size={18} /> Ask Doubt
            </button>
            <button
              onClick={() => openPanel('notes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${cfg.secondaryBtn}`}
            >
              <PencilLine size={18} /> Write Notes
            </button>
            <button
              onClick={() => openPanel('test')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${cfg.secondaryBtn}`}
            >
              <ClipboardList size={18} /> Test Yourself
            </button>
          </div>
        </div>
        <aside
          className={`fixed top-0 right-0 w-80 max-w-full h-full shadow-xl transition-transform transform ${activePanel ? 'translate-x-0' : 'translate-x-full'} ${theme === 'light' ? 'bg-white' : 'bg-[#0c1424]'}`}
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-200/50">
            <h2 className="font-semibold capitalize">{activePanel ? activePanel : ''}</h2>
            <button onClick={closePanel} aria-label="Close" className="text-xl">×</button>
          </div>
          <div className="p-4 overflow-y-auto space-y-4">
            {activePanel === 'doubt' && (
              <p>Here you can ask your questions about the lecture.</p>
            )}
            {activePanel === 'notes' && (
              <textarea className="w-full h-40 p-2 rounded border" placeholder="Write your notes here" />
            )}
            {activePanel === 'test' && (
              <p>Test yourself with quizzes coming soon!</p>
            )}
          </div>
        </aside>
        </>
      ) : (
        <p className="text-center">No video selected.</p>
      )}
    </div>
  );
}
