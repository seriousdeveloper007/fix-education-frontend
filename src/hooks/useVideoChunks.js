import { useEffect } from 'react';
import { createVideoChunk } from '../services/videoChunkService';

export function useVideoChunks({ showIframe, getCurrentTime, isPreparingRoom, isPlaying }) {
  useEffect(() => {
    if (!showIframe || !getCurrentTime || isPreparingRoom) return;

    const tickCreateChunk = async () => {
      if (!isPlaying()) return;
      try {
        const playbackTime = Math.floor(getCurrentTime());
        await createVideoChunk(playbackTime);
      } catch (err) {
        console.error('createVideoChunk failed:', err);
      }
    };

    tickCreateChunk();
    const intervalId = setInterval(tickCreateChunk, 20000);
    return () => clearInterval(intervalId);
  }, [showIframe, getCurrentTime, isPreparingRoom, isPlaying]);
}