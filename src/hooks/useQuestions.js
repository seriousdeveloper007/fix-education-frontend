import { useState, useEffect, useCallback } from 'react';
import { questionService } from '../services/questionService';
import analytics from '../services/posthogService';

export function useQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Load unattempted questions on mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await questionService.fetchUnattemptedQuestions();
        setQuestions(data);
      } catch (err) {
        console.error('Error loading questions:', err);
        setError(err.message);
        setQuestions([]);
      } finally {
        setLoaded(true);
      }
    };

    loadQuestions();
  }, []);

  // Submit answer for a question
  const submitAnswer = useCallback(async (questionId, answer) => {
    try {
      await questionService.submitQuestionAnswer({
        question_id: questionId,
        ...answer
      });
      
      // Track analytics
      analytics.questionAttempted(questionId);
      
      // Remove question from list after successful submission
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      
      return true;
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError(err.message);
      return false;
    }
  }, []);

  // Refresh questions
  const refreshQuestions = useCallback(async () => {
    setLoaded(false);
    setError(null);
    
    try {
      const data = await questionService.fetchUnattemptedQuestions();
      setQuestions(data);
    } catch (err) {
      console.error('Error refreshing questions:', err);
      setError(err.message);
      setQuestions([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  return {
    questions,
    loaded,
    error,
    submitAnswer,
    refreshQuestions
  };
}