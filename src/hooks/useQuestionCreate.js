import { useState, useCallback } from 'react';
import { questionService } from '../services/questionService';

export function useQuestionCreation() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const createQuestions = useCallback(async (tabId, playbackTime) => {
    setCreating(true);
    setError(null);
    
    try {
      const result = await questionService.createQuestions(tabId, playbackTime);
      return result;
    } catch (err) {
      console.error('Failed to create questions:', err);
      setError(err.message);
      return { totalNew: 0, data: null };
    } finally {
      setCreating(false);
    }
  }, []);

  return {
    createQuestions,
    creating,
    error
  };
}
