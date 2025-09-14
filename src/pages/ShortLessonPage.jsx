import React, { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Loader from '../components/Loader';
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

// ---------- Dynamic ESM loader (Memoized) ----------
const Remote = React.memo(({ url, exportName = 'default', ...props }) => {
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
});

// ---------- Lesson Header Component ----------
const LessonHeader = React.memo(({ lessonDisplayName }) => {
  return (
    <div className="shrink-0 flex items-center justify-between mb-4 min-w-0">
      <div className="truncate text-xl" style={{ fontFamily: 'Francus' }}>
        {lessonDisplayName}
      </div>
    </div>
  );
});

// ---------- TTS Caption Manager (Isolated State with Smooth Transition) ----------
const TTSCaptionManager = React.memo(({ speak }) => {
  const [caption, setCaption] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const captionRef = useRef(null);
  const wordsRef = useRef([]);
  const pendingTextRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const currentUtteranceRef = useRef(null);

  // Enhanced speak function that manages its own state with smooth transition
  useEffect(() => {
    // Override the speak function to manage caption state internally
    const originalSpeak = speak;
    
    window.__ttsSpeak = (text) => {
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

      // Check if speech is currently playing
      const isSpeaking = window.speechSynthesis.speaking;
      
      if (isSpeaking && currentUtteranceRef.current) {
        // Store the new text to play after transition
        pendingTextRef.current = text;
        
        // Start smooth transition
        setIsTransitioning(true);
        
        // Clear any existing transition timeout
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }
        
        // Gradually fade out current speech and start new one after 3 seconds
        const currentUtterance = currentUtteranceRef.current;
        
        // Gradually reduce volume for smooth transition
        if (currentUtterance) {
          currentUtterance.volume = Math.max(0, currentUtterance.volume * 0.7);
        }
        
        // Set transition timeout
        transitionTimeoutRef.current = setTimeout(() => {
          // Cancel current speech
          window.speechSynthesis.cancel();
          
          // Reset transition state
          setIsTransitioning(false);
          
          // Play the pending text
          if (pendingTextRef.current) {
            const pendingText = pendingTextRef.current;
            pendingTextRef.current = null;
            
            // Call the speak function again with the pending text
            playText(pendingText);
          }
        }, 3000); // 3 second delay
        
        return; // Don't play immediately, wait for transition
      }
      
      // If no speech is playing, play immediately
      playText(text);
    };

    // Helper function to actually play the text
    const playText = (text) => {
      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 0.75;
      utter.volume = 1.0; // Reset volume to full

      currentUtteranceRef.current = utter;
      const words = text.split(/\s+/);
      wordsRef.current = words;

      utter.onboundary = (event) => {
        if (event.name === 'word') {
          let charCount = 0;
          for (let i = 0; i < words.length; i++) {
            if (event.charIndex >= charCount && event.charIndex < charCount + words[i].length) {
              // Update only the word highlighting via DOM manipulation
              if (captionRef.current) {
                const spans = captionRef.current.querySelectorAll('span');
                spans.forEach((span, idx) => {
                  if (idx === i) {
                    span.style.background = '#333';
                    span.style.color = '#fff';
                    span.style.fontWeight = '600';
                    span.style.transform = 'scale(1.05)';
                  } else {
                    span.style.background = 'transparent';
                    span.style.color = '#333';
                    span.style.fontWeight = 'normal';
                    span.style.transform = 'scale(1)';
                  }
                });
              }
              break;
            }
            charCount += words[i].length + 1;
          }
        }
      };

      utter.onstart = () => {
        setCaption(text);
        setCurrentWordIndex(0);
        setIsTransitioning(false);
      };

      utter.onend = () => {
        setCaption('');
        setCurrentWordIndex(-1);
        setIsTransitioning(false);
        wordsRef.current = [];
        currentUtteranceRef.current = null;
        
        // Clear any pending transition
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
          transitionTimeoutRef.current = null;
        }
        pendingTextRef.current = null;
      };

      utter.onerror = () => {
        setCaption('');
        setCurrentWordIndex(-1);
        setIsTransitioning(false);
        wordsRef.current = [];
        currentUtteranceRef.current = null;
        
        // Clear any pending transition
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
          transitionTimeoutRef.current = null;
        }
        pendingTextRef.current = null;
      };

      window.speechSynthesis.speak(utter);
    };

    // Cleanup function
    return () => {
      window.__ttsSpeak = undefined;
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [speak]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!caption && !isTransitioning) return null;

  const words = caption.split(/\s+/);
  const windowSize = 7;
  const startIdx = Math.max(0, currentWordIndex - 3);
  const endIdx = Math.min(words.length, startIdx + windowSize);
  const visibleWords = words.slice(startIdx, endIdx);

  return (
    <div
      ref={captionRef}
      style={{
        position: 'fixed',
        bottom: 'env(safe-area-inset-bottom, 16px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '800px',
        background: isTransitioning 
          ? 'rgba(255, 255, 255, 0.7)' 
          : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        color: isTransitioning ? '#666' : '#333',
        padding: '0.75rem 1rem',
        textAlign: 'center',
        fontSize: '1.1rem',
        lineHeight: '1.5',
        zIndex: 1000,
        pointerEvents: 'none',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.08)',
        borderRadius: '12px 12px 0 0',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        opacity: isTransitioning ? 0.6 : 1,
        transition: 'all 0.5s ease',
      }}
    >
      {isTransitioning && (
        <div style={{
          position: 'absolute',
          top: '4px',
          right: '12px',
          fontSize: '0.75rem',
          color: '#888',
          fontStyle: 'italic'
        }}>
          Transitioning...
        </div>
      )}
      {visibleWords.map((word, i) => (
        <span
          key={i}
          data-word-index={startIdx + i}
          style={{
            margin: '0 0.2ch',
            padding: '0.25rem 0.375rem',
            borderRadius: '6px',
            background: 'transparent',
            color: isTransitioning ? '#666' : '#333',
            fontWeight: 'normal',
            transition: 'all 0.15s ease',
            display: 'inline-block',
            transform: 'scale(1)',
            opacity: isTransitioning ? 0.7 : 1,
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
});
// ---------- Lesson Content (Memoized) ----------
const LessonContent = React.memo(({ artifactUrl, exportName, miniLesson, speak }) => {
  return (
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
                speak={(text) => {
                  // Use the global TTS function if available, otherwise use passed speak
                  if (window.__ttsSpeak) {
                    window.__ttsSpeak(text);
                  } else {
                    speak(text);
                  }
                }}
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
  );
}, (prevProps, nextProps) => {
  // Only re-render if artifactUrl, exportName, or miniLesson changes
  return prevProps.artifactUrl === nextProps.artifactUrl &&
         prevProps.exportName === nextProps.exportName &&
         prevProps.miniLesson === nextProps.miniLesson;
});

// ---------- Page ----------
export default function ShortLessonPage() {
  const { miniLesson: miniLessonParam } = useParams();
  const miniLesson = decodeURIComponent(miniLessonParam || '');
  const location = useLocation();
  const { search, state } = location;
  const miniLessonData = state || {};
  const lessonDisplayName = miniLessonData.name || miniLesson || 'Interactive Lesson';

  const params = new URLSearchParams(search);
  const artifactOverride = params.get('artifact');
  const exportName = params.get('export') || 'default';

  const { artifactUrl, loading, error } = useShortLesson({
    miniLessonData,
    artifactOverride,
  });

  // Base speak function (will be overridden by TTSCaptionManager)
  const speak = useCallback((text) => {
    if (window.__ttsSpeak) {
      window.__ttsSpeak(text);
    } else {
      console.log('TTS not initialized yet');
    }
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
        <div className="flex-1 min-w-0 px-4 py-5 max-w-5xl mx-auto w-full flex flex-col overflow-x-hidden">
          <LessonHeader lessonDisplayName={lessonDisplayName} />
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <div className="text-center">
              <Loader />
              <p className="mt-4 text-gray-600">Loading lesson content...</p>
            </div>
          </div>
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
          <LessonHeader lessonDisplayName={lessonDisplayName} />
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
        <LessonHeader lessonDisplayName={lessonDisplayName} />
        
        {/* Lesson Content - Memoized and won't re-render on caption changes */}
        <LessonContent 
          artifactUrl={artifactUrl}
          exportName={exportName}
          miniLesson={miniLesson}
          speak={speak}
        />
      </div>
      
      {/* TTS Caption Manager - Isolated state management */}
      <TTSCaptionManager speak={speak} />
    </div>
  );
}