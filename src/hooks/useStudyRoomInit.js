import { useState, useEffect } from 'react';
import { createTab } from '../services/tabService';
import { createVideoChunk } from '../services/videoChunkService';
import analytics from '../services/posthogService';

export function useStudyRoomInit({ showIframe, isLoggedIn, videoUrl, startTime }) {
  const [isPreparingRoom, setIsPreparingRoom] = useState(showIframe && isLoggedIn);
  const [tabId, setTabId] = useState(null);

  useEffect(() => {
    if (!showIframe || !isLoggedIn) return;

    // Clear previous session data
    localStorage.removeItem('tabId');
    localStorage.removeItem('chatId');
    Object.keys(localStorage)
      .filter((key) => key.startsWith('noteId'))
      .forEach((key) => localStorage.removeItem(key));

    const { id: userId } = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    if (!userId || !token) return;

    const attemptCreateTab = async () => {
      try {
        setIsPreparingRoom(true);
        const { id } = await createTab(userId, videoUrl, token);
        localStorage.setItem('tabId', id);
        setTabId(id);
        analytics.youtubeLearningStarted(videoUrl);
        setIsPreparingRoom(false);
        
        // Initial chunk creation
        setTimeout(() => {
          createVideoChunk(Math.floor(startTime || 0)).catch(console.error);
        }, 0);
      } catch (err) {
        console.error('createTab failed, retrying in 5s', err);
        setTimeout(attemptCreateTab, 5000);
      }
    };

    attemptCreateTab();
  }, [showIframe, isLoggedIn, videoUrl, startTime]);

  return { isPreparingRoom, tabId };
}
