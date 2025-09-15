import { useState, useEffect, useRef } from 'react';
import { createMiniLesson } from '../services/miniLessonService';
import { API_BASE_URL } from '../config';

export function useShortLesson({ miniLessonId, artifactOverride }) {
  const [artifactUrl, setArtifactUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const retryTimeoutRef = useRef(null);
  const canceledRef = useRef(false);

  useEffect(() => {
    canceledRef.current = false;

    const fetchArtifact = async () => {
      setLoading(true);
      setError(null);

      if (artifactOverride) {
        setArtifactUrl(artifactOverride);
        setLoading(false);
        return;
      }

      if (!miniLessonId) {
        setError('No mini lesson ID provided');
        setLoading(false);
        return;
      }

      const attemptFetch = async (retryCount = 0) => {
        if (canceledRef.current) return;

        try {
          const data = await createMiniLesson(miniLessonId);

          const filename = data?.react_code;
          if (!filename || typeof filename !== 'string') {
            throw new Error('Invalid or missing artifact filename in response');
          }

          const url = `${API_BASE_URL.replace(/\/$/, '')}/artifacts/${filename}`;
          if (!canceledRef.current) {
            setArtifactUrl(url);
            setLoading(false);
          }
        } catch (err) {
          if (canceledRef.current) return;

          // Check if it's a 429 error (generation in progress)
          if (err.message.includes('429') || err.message.includes('generation already in progress')) {
            // Keep loading state and retry after a delay
            console.log(`Generation in progress, retrying in 3 seconds... (attempt ${retryCount + 1})`);
            
            retryTimeoutRef.current = setTimeout(() => {
              if (!canceledRef.current) {
                attemptFetch(retryCount + 1);
              }
            }, 5000); // Retry every 3 seconds
          } else {
            // For other errors, show the error message
            setError(err.message || 'Unknown error');
            setLoading(false);
          }
        }
      };

      attemptFetch();
    };

    fetchArtifact();

    return () => {
      canceledRef.current = true;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [miniLessonId, artifactOverride]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return { artifactUrl, loading, error };
}