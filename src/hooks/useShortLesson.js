import { useEffect, useState } from 'react';
import { createMiniLesson } from '../services/miniLessonService';

function extractLessonUrl(response) {
  if (!response || typeof response !== 'object') {
    return null;
  }

  return (
    response.vercel_link ||
    response.vercelLink ||
    response.vercel_url ||
    response.vercelUrl ||
    null
  );
}

export function useShortLesson(miniLessonId) {
  const [lessonUrl, setLessonUrl] = useState(null);
  const [loading, setLoading] = useState(Boolean(miniLessonId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!miniLessonId) {
      setLessonUrl(null);
      setLoading(false);
      setError('Mini lesson ID is required.');
      return undefined;
    }

    let isCancelled = false;

    async function fetchLesson() {
      setLoading(true);
      setError(null);

      try {
        const response = await createMiniLesson(miniLessonId);
        const url = extractLessonUrl(response);

        if (!isCancelled) {
          if (url) {
            setLessonUrl(url);
            setError(null);
          } else {
            setLessonUrl(null);
            setError('Mini lesson link not found in the response.');
          }

          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setLessonUrl(null);
          setError(err?.message || 'Failed to load the mini lesson.');
          setLoading(false);
        }
      }
    }

    fetchLesson();

    return () => {
      isCancelled = true;
    };
  }, [miniLessonId]);

  return { lessonUrl, loading, error };
}
