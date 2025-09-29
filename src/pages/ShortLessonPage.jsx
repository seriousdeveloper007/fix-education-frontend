import { useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import LessonHeader from '../components/lesson/LessonHeader';
import { useShortLesson } from '../hooks/useShortLesson';

function formatLessonName(slug, fallback) {
  if (!slug) {
    return fallback;
  }

  return slug
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export default function ShortLessonPage() {
  const { id, miniLessonSlug } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const lessonDisplayName = state?.name || formatLessonName(miniLessonSlug, 'Interactive Lesson');
  const miniLessonId = state?.id ?? state?.mini_lesson_id ?? id;

  const { lessonUrl, loading, error } = useShortLesson(miniLessonId);

  const handleStartDiscussion = useCallback(() => {
    if (!id || !miniLessonSlug) return;

    navigate(`/${id}/${miniLessonSlug}/topic-discussion`, {
      state,
      replace: false,
    });
  }, [id, miniLessonSlug, navigate, state]);

  const iframeSrc = lessonUrl;

  return (
    <div className="lesson-page-container min-h-[100dvh] w-[100dvw] max-w-[100dvw] flex flex-col overflow-x-hidden">
      <Navbar />

      {/* Mobile: full width, Desktop: constrained width */}
      <div className="flex-1 px-0 md:px-4 pt-5 pb-0 w-full md:max-w-5xl md:mx-auto flex flex-col overflow-x-hidden">
        {/* Header with responsive padding */}
        <div className="px-4 md:px-0 mb-4">
          <LessonHeader
            lessonDisplayName={lessonDisplayName}
            actionLabel="Start Discussion"
            onActionClick={handleStartDiscussion}
          />
        </div>

        {/* Mobile: full screen container, Desktop: bordered container */}
        <div className="flex-1 flex flex-col md:border md:border-gray-200 md:rounded-lg overflow-hidden bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 text-slate-600 p-12">
              <span className="text-sm font-medium">Preparing your mini lesson…</span>
              <span className="text-xs text-slate-400">This may take a few seconds.</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-sm font-semibold text-red-600">Unable to load the mini lesson.</p>
                <p className="mt-2 text-xs text-red-500 break-words max-w-md mx-auto">{error}</p>
              </div>
            </div>
          ) : iframeSrc ? (
            <iframe
              key={iframeSrc}
              src={iframeSrc}
              title={lessonDisplayName}
              className="w-full h-full border-0 flex-1"
              style={{ 
                minHeight: '70vh', // Ensure minimum height
                height: '100%' // Take full container height
              }}
              loading="lazy"
              allow="fullscreen; clipboard-read; clipboard-write; accelerometer; gyroscope"
              allowFullScreen
              onLoad={(e) => {
                // Auto-resize iframe based on content (only for desktop)
                try {
                  const iframe = e.target;
                  const resizeIframe = () => {
                    try {
                      // Only auto-resize on desktop (md breakpoint and above)
                      if (window.innerWidth >= 768) {
                        const contentHeight = iframe.contentDocument?.body?.scrollHeight;
                        if (contentHeight && contentHeight > 600) {
                          iframe.style.height = `${contentHeight}px`;
                        }
                      }
                    } catch (err) {
                      // Cross-origin restrictions - fallback to default height
                      console.log('Cannot access iframe content for auto-resize due to cross-origin restrictions');
                    }
                  };
                  
                  resizeIframe();
                  
                  // Try to resize after a delay for dynamic content
                  setTimeout(resizeIframe, 1000);
                  setTimeout(resizeIframe, 3000);
                } catch (err) {
                  console.log('Iframe auto-resize not available');
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center p-12 text-sm text-slate-500 text-center">
              Mini lesson link is not available yet. Please check back soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}