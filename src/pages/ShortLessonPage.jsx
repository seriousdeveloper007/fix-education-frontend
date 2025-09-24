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

  return (
    <div className="lesson-page-container min-h-[100dvh] w-[100dvw] max-w-[100dvw] flex flex-col overflow-x-hidden">
      <Navbar />

      <div className="flex-1 min-w-0 px-4 py-5 max-w-5xl mx-auto w-full flex flex-col overflow-x-hidden">
        <LessonHeader
          lessonDisplayName={lessonDisplayName}
          actionLabel="Start Discussion"
          onActionClick={handleStartDiscussion}
        />

        <div className="mt-4 flex-1 min-h-0">
          <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-600">
                <span className="text-sm font-medium">Preparing your mini lesson…</span>
                <span className="text-xs text-slate-400">This may take a few seconds.</span>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <p className="text-sm font-semibold text-red-600">Unable to load the mini lesson.</p>
                  <p className="mt-2 text-xs text-red-500 break-words max-w-md mx-auto">{error}</p>
                </div>
              </div>
            ) : lessonUrl ? (
              <>
                <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2">
                  <span className="truncate text-xs text-slate-500" title={lessonUrl}>
                    {lessonUrl}
                  </span>
                  <a
                    href={lessonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    Open in new tab
                  </a>
                </div>
                <iframe
                  key={lessonUrl}
                  src={lessonUrl}
                  title={lessonDisplayName}
                  className="w-full flex-1"
                  loading="lazy"
                  allow="fullscreen; clipboard-read; clipboard-write; accelerometer; gyroscope"
                  allowFullScreen
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 text-sm text-slate-500 text-center">
                Mini lesson link is not available yet. Please check back soon.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
