import { useState, useEffect } from 'react';
import { createMiniLesson } from '../services/miniLessonService';
import { API_BASE_URL } from '../config';

export function useShortLesson({ miniLessonId, artifactOverride }) {
  const [artifactUrl, setArtifactUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;

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

      try {
        const data = await createMiniLesson(miniLessonId);

        const filename = data?.react_code;
        if (!filename || typeof filename !== 'string') {
          throw new Error('Invalid or missing artifact filename in response');
        }

        const url = `${API_BASE_URL.replace(/\/$/, '')}/artifacts/${filename}`;
        if (!canceled) setArtifactUrl(url);
      } catch (err) {
        if (!canceled) setError(err.message || 'Unknown error');
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    fetchArtifact();

    return () => {
      canceled = true;
    };
  }, [miniLessonId, artifactOverride]);

  return { artifactUrl, loading, error };
}