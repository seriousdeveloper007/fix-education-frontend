import { useEffect, useState } from 'react';
import { createMiniLesson } from '../services/miniLessonService';
import { API_BASE_URL } from '../config';

export function useShortLesson({ miniLesson, lessonName, miniLessonList, artifactOverride }) {
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

      if (!miniLesson) {
        setError('No lesson name provided');
        setLoading(false);
        return;
      }

      try {
        const data = await createMiniLesson({
          miniLesson,
          lessonName,
          miniLessonList,
        });

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
  }, [miniLesson, lessonName, miniLessonList, artifactOverride]);

  return { artifactUrl, loading, error };
}
