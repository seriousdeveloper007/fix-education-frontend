import React, { useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import LessonHeader from '../components/lesson/LessonHeader';

// Minimal page that only shows the lesson name, a "Start Discussion" button,
// and an iframe that embeds a remote app (e.g., a Vercel URL).
// Pass a custom URL with the query param `?src=...` if needed.

export default function ShortLessonPage() {
  const { id, miniLessonSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { search, state } = location;

  // Human‑readable lesson title from slug or route state
  const lessonDisplayName = miniLessonSlug
    ? miniLessonSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : state?.name || 'Interactive Lesson';

  // Allow overriding the iframe URL via `?src=`; otherwise default to your Vercel link
  const params = new URLSearchParams(search);
  const iframeSrc = params.get('src') || 'https://left-join33-l6k4bzdh2-ilon-ais-projects.vercel.app';

  const handleStartDiscussion = useCallback(() => {
    if (!id || !miniLessonSlug) return;
    navigate(`/${id}/${miniLessonSlug}/topic-discussion${search || ''}`, {
      state,
      replace: false,
    });
  }, [id, miniLessonSlug, navigate, search, state]);

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
          {/* IFRAME EMBED */}
          <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden bg-white">
            <iframe
              src={iframeSrc}
              title={lessonDisplayName}
              className="w-full h-[80vh]"
              loading="lazy"
              allow="fullscreen; clipboard-read; clipboard-write; accelerometer; gyroscope"
              // NOTE: Do not set a restrictive sandbox if the remote app needs scripts/cookies.
              // sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
