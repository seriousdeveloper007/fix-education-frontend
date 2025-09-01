import { useEffect } from 'react';

export function usePlaybackTracking({ showIframe, getCurrentTime, videoId, isPreparingRoom }) {
  useEffect(() => {
    if (!showIframe || !getCurrentTime || !videoId || isPreparingRoom) return;

    const savePlaybackTime = () => {
      try {
        const currentTime = Math.floor(getCurrentTime());
        if (currentTime > 0) {
          localStorage.setItem(`playbackTime_${videoId}`, currentTime.toString());
        }
      } catch (error) {
        console.error('Failed to save playback time:', error);
      }
    };

    const intervalId = setInterval(savePlaybackTime, 2000);
    return () => clearInterval(intervalId);
  }, [showIframe, getCurrentTime, videoId, isPreparingRoom]);
}