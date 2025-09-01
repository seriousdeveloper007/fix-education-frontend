import { useState, useEffect } from 'react';
import { fetchUnattemptedQuestions, createQuestions } from '../services/questionService';

export function useQuestionManagement({ showIframe, isPreparingRoom, isPlaying, getCurrentTime }) {
  const [unattemptedQuestionCount, setUnattemptedQuestionCount] = useState(0);

  // Load initial questions
  useEffect(() => {
    if (!showIframe || isPreparingRoom) return;

    (async () => {
      const data = await fetchUnattemptedQuestions();
      setUnattemptedQuestionCount(data.length);
    })();
  }, [showIframe, isPreparingRoom]);

  // Create questions periodically
  useEffect(() => {
    if (!showIframe || isPreparingRoom) return;

    const tickCreateQuestions = async () => {
      if (!isPlaying()) return;
      const tabId = localStorage.getItem('tabId');
      if (!tabId || !getCurrentTime) return;

      const playbackTime = Math.floor(getCurrentTime());
      if (playbackTime <= 60) return;

      const { totalNew } = await createQuestions(tabId, playbackTime);
      if (totalNew > 0) {
        setUnattemptedQuestionCount((prev) => prev + totalNew);
      }
    };

    const intervalId = setInterval(tickCreateQuestions, 20000);
    return () => clearInterval(intervalId);
  }, [showIframe, isPreparingRoom, isPlaying, getCurrentTime]);

  const updateQuestionCount = (delta) => {
    setUnattemptedQuestionCount((prev) => Math.max(0, prev + delta));
  };

  return { unattemptedQuestionCount, updateQuestionCount };
}
