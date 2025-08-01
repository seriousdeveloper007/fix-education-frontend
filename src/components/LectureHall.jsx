// import React, { useEffect, useRef, useState } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import { HelpCircle, PencilLine, ClipboardList, ArrowLeft } from 'lucide-react';
// import themeConfig from './themeConfig';
// import { useAudioRecorder } from './AudioRecorderContext.jsx';

// function extractId(url) {
//   try {
//     const u = new URL(url);
//     if (u.hostname === 'youtu.be') {
//       return u.pathname.slice(1);
//     }
//     return u.searchParams.get('v');
//   } catch {
//     return null;
//   }
// }

// export default function LectureHall() {
//   const [params] = useSearchParams();
//   const navigate = useNavigate();
//   const videoUrl = params.get('video');
//   const videoId = extractId(videoUrl);
//   const cfg = themeConfig.website;
//   const { stop } = useAudioRecorder();
//   const [activePanel, setActivePanel] = useState(null);
//   const iframeRef = useRef(null);

//   const pauseVideo = () => {
//     if (iframeRef.current) {
//       iframeRef.current.contentWindow.postMessage(
//         '{"event":"command","func":"pauseVideo","args":""}',
//         '*'
//       );
//     }
//   };

//   const openPanel = (panel) => {
//     pauseVideo();
//     setActivePanel((prev) => (prev === panel ? null : panel));
//   };

//   const closePanel = () => setActivePanel(null);

//   useEffect(() => {
//     return () => {
//       stop();
//     };
//   }, [stop]);

//   const handleBack = () => {
//     navigate('/platform');
//   };

//   return (
//     <div className="relative p-6 pt-14">
//       <button
//         onClick={handleBack}
//         className={`absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full ${cfg.secondaryBtn}`}
//       >
//         <ArrowLeft size={18} /> Back
//       </button>
//       {videoId ? (
//         <>
//         <div className="space-y-8 max-w-6xl mx-auto">
//           <div className="rounded-2xl overflow-hidden shadow-lg aspect-video">
//             <iframe
//               ref={iframeRef}
//               src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
//               title="YouTube video"
//               className="w-full h-full"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//             />
//           </div>
//           <div className="flex justify-center gap-6">
//             <button
//               onClick={() => openPanel('doubt')}
//               className={`flex items-center gap-2 px-4 py-2 rounded-full ${cfg.primaryBtn}`}
//             >
//               <HelpCircle size={18} /> Ask Doubt
//             </button>
//             <button
//               onClick={() => openPanel('notes')}
//               className={`flex items-center gap-2 px-4 py-2 rounded-full ${cfg.primaryBtn}`}
//             >
//               <PencilLine size={18} /> Write Notes
//             </button>
//             <button
//               onClick={() => openPanel('test')}
//               className={`flex items-center gap-2 px-4 py-2 rounded-full ${cfg.primaryBtn}`}
//             >
//               <ClipboardList size={18} /> Test Yourself
//             </button>
//           </div>
//         </div>
//         <aside
//           className={`fixed top-0 right-0 w-[30rem] max-w-full h-full shadow-xl transition-transform transform ${activePanel ? 'translate-x-0' : 'translate-x-full'} bg-white`}
//         >
//           <div className="flex items-center justify-between p-4 border-b border-slate-200/50">
//             <h2 className="font-semibold capitalize">{activePanel ? activePanel : ''}</h2>
//             <button onClick={closePanel} aria-label="Close" className="text-xl">×</button>
//           </div>
//           <div className="p-4 overflow-y-auto space-y-4">
//             {activePanel === 'doubt' && (
//               <p>Here you can ask your questions about the lecture.</p>
//             )}
//             {activePanel === 'notes' && (
//               <textarea className="w-full h-40 p-2 rounded border" placeholder="Write your notes here" />
//             )}
//             {activePanel === 'test' && (
//               <p>Test yourself with quizzes coming soon!</p>
//             )}
//           </div>
//         </aside>
//         </>
//       ) : (
//         <p className="text-center">No video selected.</p>
//       )}
//     </div>
//   );
// }
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

export default function LectureHall() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const videoUrl = params.get('video');
  const videoId = extractId(videoUrl);
  const cfg = themeConfig.app; // Updated to use app config
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
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const closePanel = () => setActivePanel(null);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const handleBack = () => {
    navigate('/platform');
  };

  return (
    <div className="relative p-6 pt-14 min-h-screen overflow-hidden flex flex-col bg-slate-50 text-slate-900 font-fraunces selection:bg-emerald-300/30">
      <button
        onClick={handleBack}
        className={`absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full ${cfg.secondaryBtn}`}
      >
        <ArrowLeft size={18} /> Back
      </button>
      {videoId ? (
        <>
          <div className="space-y-8 max-w-6xl mx-auto flex-1 flex flex-col justify-center">
            {/* Updated video container with app-specific styling */}
            <div className={cfg.videoContainer}>
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                title="YouTube video"
                className={cfg.videoPlayer}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            {/* Action buttons with consistent styling */}
            <div className="flex justify-center gap-6">
              <button
                onClick={() => openPanel('doubt')}
                className={`flex items-center gap-2 px-6 py-3 ${cfg.primaryBtn}`}
              >
                <HelpCircle size={18} /> Ask Doubt
              </button>
              <button
                onClick={() => openPanel('notes')}
                className={`flex items-center gap-2 px-6 py-3 ${cfg.primaryBtn}`}
              >
                <PencilLine size={18} /> Write Notes
              </button>
              <button
                onClick={() => openPanel('test')}
                className={`flex items-center gap-2 px-6 py-3 ${cfg.primaryBtn}`}
              >
                <ClipboardList size={18} /> Test Yourself
              </button>
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
                    Welcome! I'm here to help resolve your doubts about this lecture. Ask me anything!
                  </div>
                  <div className="space-y-3">
                    {/* Placeholder for chat messages */}
                  </div>
                </div>
              )}
              
              {activePanel === 'notes' && (
                <div className="space-y-4">
                  <div className={cfg.notesToolbar}>
                    <button className={`${cfg.interactiveBtn} px-3 py-1 text-sm`}>Bold</button>
                    <button className={`${cfg.interactiveBtn} px-3 py-1 text-sm`}>Italic</button>
                    <button className={`${cfg.interactiveBtn} px-3 py-1 text-sm`}>Highlight</button>
                  </div>
                  <textarea 
                    className={`${cfg.notesEditor} w-full border-0 resize-none ${cfg.focusRing}`}
                    placeholder="Write your notes here. They'll be automatically saved with timestamps."
                    rows="15"
                  />
                  <div className="space-y-2">
                    <h3 className={`text-sm font-medium ${cfg.text}`}>Recent Notes</h3>
                    <div className={cfg.noteCard}>
                      <p className={cfg.text}>Sample note from the lecture...</p>
                      <span className={cfg.noteTimestamp}>12:34</span>
                    </div>
                  </div>
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
