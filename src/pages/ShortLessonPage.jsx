import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import { useShortLesson } from '../hooks/useShortLesson';

// ---------- Error Boundary ----------
class SafeBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('Remote module crashed:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 h-full flex items-center justify-center">
          <div>
            <div className="font-semibold">Lesson failed to load</div>
            <div className="text-sm mt-1">{String(this.state.error.message || this.state.error)}</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------- Dynamic ESM loader ----------
function Remote({ url, exportName = 'default', ...props }) {
  const LazyComp = React.lazy(async () => {
    const mod = await import(/* @vite-ignore */ url);
    const picked = mod[exportName];
    if (!picked) {
      throw new Error(
        `Export "${exportName}" not found from ${url}. ` +
        `Available exports: ${Object.keys(mod).join(', ') || '(none)'}`
      );
    }
    return { default: picked };
  });

  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-gray-600">
          Loading lesson…
        </div>
      }
    >
      <LazyComp {...props} />
    </Suspense>
  );
}

// ---------- Page ----------
export default function ShortLessonPage() {
  const { miniLesson: miniLessonParam } = useParams();
  const miniLesson = decodeURIComponent(miniLessonParam || '');
  const location = useLocation();
  const { search, state } = location;
  const lessonName = state?.lessonName || '';
  const miniLessonList = state?.miniLessonList || [];

  const params = new URLSearchParams(search);
  const artifactOverride = params.get('artifact');
  const exportName = params.get('export') || 'default';

  const { artifactUrl, loading, error } = useShortLesson({
    miniLesson,
    lessonName,
    miniLessonList,
    artifactOverride,
  });


  // 👇 TTS State
  const [caption, setCaption] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(-1); // 👈 For word highlighting

  // 👇 Enhanced speak function with word boundary tracking
  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported.');
      setCaption(text);
      setCurrentWordIndex(-1);
      setTimeout(() => {
        setCaption('');
        setCurrentWordIndex(-1);
      }, 3000);
      return;
    }

    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.75;

    const words = text.split(/\s+/);

    // Highlight word as it's spoken
    utter.onboundary = (event) => {
      if (event.name === 'word') {
        let currentIndex = 0;
        let charCount = 0;
        for (let i = 0; i < words.length; i++) {
          if (event.charIndex >= charCount && event.charIndex < charCount + words[i].length) {
            setCurrentWordIndex(i);
            break;
          }
          charCount += words[i].length + 1; // +1 for space
        }
      }
    };

    utter.onstart = () => {
      setCaption(text);
      setCurrentWordIndex(0); // Start with first word highlighted
    };

    utter.onend = () => {
      setCaption('');
      setCurrentWordIndex(-1);
    };

    utter.onerror = () => {
      setCaption('');
      setCurrentWordIndex(-1);
    };

    window.speechSynthesis.speak(utter);
  }, []);

  // CSS styles for layout
  useEffect(() => {
    const css = `
      body.lesson-active {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        width: 100vw !important;
        max-width: 100vw !important;
      }
      .lesson-shell {
        width: 100%;
        max-width: 100%;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        overflow-y: visible;
        position: relative;
        contain: layout style;
      }
      .lesson-canvas {
        width: 100%;
        max-width: 100%;
        min-height: 100%;
        overflow-x: hidden;
        overflow-y: visible;
        touch-action: manipulation;
        position: relative;
        contain: layout style;
      }
      .lesson-canvas > *,
      .lesson-canvas > * > *,
      .lesson-canvas > * > * > * {
        max-width: 100% !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .lesson-content-wrapper {
        width: 100% !important;
        max-width: 100% !important;
        min-height: 100% !important;
        overflow-x: hidden !important;
        overflow-y: visible !important;
        display: flex;
        flex-direction: column;
        box-sizing: border-box !important;
        contain: layout style;
      }
      .lesson-content-wrapper > * {
        flex: 1 1 auto;
        min-width: 0;
        max-width: 100% !important;
        width: 100% !important;
        overflow-x: hidden !important;
        overflow-y: visible !important;
        box-sizing: border-box !important;
      }
      .lesson-container-scrollable {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        max-width: 100% !important;
      }
    `;
    const style = document.createElement('style');
    style.setAttribute('data-lesson-css', 'short-lesson-page');
    style.textContent = css;
    document.head.appendChild(style);
    document.body.classList.add('lesson-active');

    return () => {
      const n = document.querySelector('style[data-lesson-css="short-lesson-page"]');
      if (n) n.remove();
      document.body.classList.remove('lesson-active');
    };
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="lesson-page-container min-h-[100dvh] w-[100dvw] max-w-[100dvw] flex flex-col overflow-x-hidden">
        <Navbar />
        <div className="flex-1 min-h-0 min-w-0 flex items-center justify-center text-gray-600">
          Preparing your lesson…
        </div>
      </div>
    );
  }

  // Error
  if (error || !artifactUrl) {
    return (
      <div className="lesson-page-container min-h-[100dvh] w-[100dvw] max-w-[100dvw] flex flex-col overflow-x-hidden">
        <Navbar />
        <div className="flex-1 min-h-0 min-w-0 px-4 py-5 max-w-5xl mx-auto w-full flex flex-col">
          <div className="shrink-0 flex items-center justify-between">
            <h1 className="text-2xl font-bold truncate">{miniLesson || 'Interactive Lesson'}</h1>
          </div>
          <div className="mt-4 flex-1 min-h-0 flex items-center justify-center">
            <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-800 max-w-md">
              <div className="font-semibold">Lesson not loaded</div>
              <div className="text-sm mt-1 break-words">
                {error || 'Could not retrieve the lesson artifact. Please try again later.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success
  return (
    <div className="lesson-page-container min-h-[100dvh] w-[100dvw] max-w-[100dvw] flex flex-col overflow-x-hidden">
      <Navbar />

      <div className="flex-1 min-w-0 px-4 py-5 max-w-5xl mx-auto w-full flex flex-col overflow-x-hidden">
        <div className="shrink-0 flex items-center justify-between mb-4 min-w-0">
          <h1 className="text-2xl font-bold truncate">{miniLesson || 'Interactive Lesson'}</h1>
        </div>

        {/* LESSON CANVAS */}
        <div className="flex-1 min-w-0 overflow-x-hidden border border-gray-200 rounded-lg bg-white lesson-container-scrollable">
          <div className="lesson-shell">
            <div className="lesson-canvas">
              <SafeBoundary>
                <div className="lesson-content-wrapper">
                  <Remote
                    url={artifactUrl}
                    exportName={exportName}
                    lessonId={miniLesson || 'unknown-lesson'}
                    viewport="mobile"
                    theme="light"
                    speak={speak} // 👈 Passed to dynamic module
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      minHeight: '100%',
                      overflowX: 'hidden',
                      overflowY: 'visible',
                      boxSizing: 'border-box',
                      display: 'block',
                      position: 'relative'
                    }}
                    className="w-full max-w-full min-h-full overflow-x-hidden overflow-y-visible block relative"
                  />
                </div>
              </SafeBoundary>
            </div>
          </div>
        </div>
      </div>
      {caption && (
  <div
    style={{
      position: 'fixed',
      bottom: 'env(safe-area-inset-bottom, 16px)',
      left: '50%',
      transform: 'translateX(-50%) translateY(0)',
      width: '100%',
      maxWidth: '800px',
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      color: '#333',
      padding: '0.75rem 1rem',
      textAlign: 'center',
      fontSize: '1.1rem',
      lineHeight: '1.5',
      zIndex: 1000,
      pointerEvents: 'none',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.08)',
      opacity: 1,
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      borderRadius: '12px 12px 0 0',
      whiteSpace: 'nowrap', // Prevent wrapping
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }}
  >
    {(() => {
      const words = caption.split(/\s+/);
      if (!words.length) return null;

      const windowSize = 7; // Show 7 words total: 3 before, 1 current, 3 after
      const startIdx = Math.max(0, currentWordIndex - 3);
      const endIdx = Math.min(words.length, startIdx + windowSize);

      const slice = words.slice(startIdx, endIdx);
      const centerIndex = slice.findIndex((_, i) => i === currentWordIndex - startIdx);

      return slice.map((word, i) => (
        <span
          key={i}
          style={{
            margin: '0 0.2ch',
            padding: '0.25rem 0.375rem',
            borderRadius: '6px',
            background: i === centerIndex ? '#333' : 'transparent',
            color: i === centerIndex ? '#fff' : '#333',
            fontWeight: i === centerIndex ? '600' : 'normal',
            transition: 'all 0.15s ease',
            display: 'inline-block',
            transform: i === centerIndex ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          {word}
        </span>
      ));
    })()}
  </div>
)}
      {/* 👇 ANIMATION EXIT TRIGGER — renders briefly to animate out when caption clears */}
      {!caption && (
        <div
          style={{
            position: 'fixed',
            bottom: '-100px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '800px',
            opacity: 0,
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}