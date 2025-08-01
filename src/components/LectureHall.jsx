
import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import themeConfig from './themeConfig';
import { useAudioRecorder } from './AudioRecorderContext.jsx';
import { useLectureHall } from './LectureHallContext.jsx';
import { Sparkles } from 'lucide-react';

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

export default function LectureHall() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const videoUrl = params.get('video');
  const videoId = extractId(videoUrl);
  const cfg = themeConfig.app; // Updated to use app config
  const { stop } = useAudioRecorder();
  const { activePanel, closePanel, registerPause } = useLectureHall();
  const iframeRef = useRef(null);

  const pauseVideo = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      );
    }
  };


  useEffect(() => {
    registerPause(pauseVideo);
  }, [registerPause]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return (
    <div
      className={`relative h-full overflow-hidden p-2 pt-2 bg-slate-50 text-slate-900 font-fraunces selection:bg-emerald-300/30 ${
        activePanel ? 'pr-[30rem]' : ''
      }`}
    >
      {videoId ? (
        <>
          <div className="h-full">
            {/* Updated video container with app-specific styling */}
            <div className={`${cfg.videoContainer} h-full`}>
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                title="YouTube video"
                className={`${cfg.videoPlayer} h-full`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
          </div>
          
          {/* Updated sidebar with app-specific styling based on panel type */}
          <aside
            className={`fixed top-0 right-0 w-[30rem] max-w-full h-full shadow-xl transition-transform transform ${
              activePanel ? 'translate-x-0' : 'translate-x-full'
            } ${
              activePanel === 'doubt' ? cfg.aiChatContainer : 
              activePanel === 'notes' ? cfg.notesContainer : 
              activePanel === 'test' ? cfg.quizContainer : 
              cfg.cardBg
            }`}
          >
            {/* Panel header */}
            <div className={`flex items-center justify-between p-4 ${
              activePanel === 'doubt' ? cfg.aiChatHeader : 
              activePanel === 'notes' ? cfg.notesHeader : 
              'border-b border-slate-200/50 bg-white/80'
            }`}>
              <h2 className={`font-semibold capitalize ${cfg.heading}`}>
                {activePanel === 'doubt' ? 'AI Doubt Resolution' : 
                 activePanel === 'notes' ? 'Learning Notes' : 
                 activePanel === 'test' ? 'Knowledge Test' : 
                 activePanel || ''}
              </h2>
              <button 
                onClick={closePanel} 
                aria-label="Close" 
                className={`text-xl hover:bg-slate-100 p-1 rounded ${cfg.hoverEffect}`}
              >
                ×
              </button>
            </div>
            
            {/* Panel content with specific styling for each panel type */}
            <div className={`overflow-y-auto h-full pb-16 ${
              activePanel === 'doubt' ? 'p-0' : 'p-4'
            }`}>
              {activePanel === 'doubt' && (
                <div className={cfg.aiChatMessages}>
                  <div className={`${cfg.aiMessageBot} mb-4`}>
                    Welcome! I&apos;m here to help resolve your doubts about this lecture. Ask me anything!
                  </div>
                  <div className="space-y-3">
                    {/* Placeholder for chat messages */}
                  </div>
                </div>
              )}
              
              {activePanel === 'notes' && (
                <div className="flex flex-col h-full space-y-4">
                  <button
                    className={`${cfg.successBtn} flex items-center gap-1 px-2 py-1 text-xs self-start`}
                  >
                    <Sparkles className="w-3 h-3" />
                    Improve Notes
                  </button>
                  <textarea
                    className={`${cfg.notesEditor} flex-1 w-full border-0 resize-none ${cfg.focusRing}`}
                    placeholder="Write your notes here. They'll be automatically saved with timestamps."
                  />
                </div>
              )}
              
              {activePanel === 'test' && (
                <div className="space-y-4">
                  <div className={cfg.progressContainer}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={cfg.progressText}>Quiz Progress</span>
                      <span className={cfg.progressText}>0/5</span>
                    </div>
                    <div className={cfg.progressBar}>
                      <div className={cfg.progressFill} style={{width: '0%'}}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className={cfg.quizQuestion}>
                      Ready to test your understanding of this lecture?
                    </div>
                    <button className={`w-full ${cfg.successBtn} py-3`}>
                      Start Quiz
                    </button>
                    
                    <div className="text-center">
                      <p className={cfg.subtext}>
                        AI-generated questions based on the video content
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Fixed input area for doubt panel */}
            {activePanel === 'doubt' && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask your question here..."
                    className={cfg.aiChatInput}
                  />
                  <button className={cfg.aiChatButton}>
                    Send
                  </button>
                </div>
              </div>
            )}
          </aside>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <p className={`text-center ${cfg.text} text-lg`}>No video selected.</p>
          <button 
            onClick={() => navigate('/platform')}
            className={cfg.primaryBtn + ' px-6 py-3'}
          >
            Select a Video
          </button>
        </div>
      )}
    </div>
  );
}
