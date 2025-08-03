import { useEffect, useRef, useCallback } from 'react';

export function useYouTubePlayer(videoId) {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const hasInitializedRef = useRef(false);

  // Load YouTube IFrame API once
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
  }, []);

  // Initialize YouTube Player when iframe is ready
  useEffect(() => {
    if (!videoId) return;

    const tryInit = () => {
      if (hasInitializedRef.current) return;

      if (window.YT && iframeRef.current && !playerRef.current) {
        console.log('✅ Initializing YouTube Player');
        playerRef.current = new window.YT.Player(iframeRef.current, {
          events: {
            onReady: () => {
              console.log('🎬 YT Player Ready');
            },
            onStateChange: (event) => {
              console.log('🎮 Player state changed:', event.data);
            },
          },
        });
        hasInitializedRef.current = true;
      } else {
        setTimeout(tryInit, 200); // Retry after 200ms if iframe or YT is not ready
      }
    };

    if (window.YT && window.YT.Player) {
      tryInit();
    } else {
      window.onYouTubeIframeAPIReady = tryInit;
    }
  }, [videoId]);

  const play = useCallback(() => {
    if (playerRef.current?.playVideo) {
      playerRef.current.playVideo();
    }
  }, []);

  const pause = useCallback(() => {
    console.log('⏸️ pause() called');
    if (playerRef.current?.pauseVideo) {
      playerRef.current.pauseVideo();
    } else {
      console.warn('❌ pauseVideo() not available — playerRef:', playerRef.current);
    }
  }, []);

  const getCurrentTime = useCallback(() => {
    return playerRef.current?.getCurrentTime?.() ?? null;
  }, []);

  // Optional: Log playback time every 30 seconds
  useEffect(() => {
    if (!videoId) return;

    let interval = null;
    let readyCheck = null;

    readyCheck = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        clearInterval(readyCheck);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(readyCheck);
    };
  }, [videoId]);

  return {
    iframeRef,
    play,
    pause,
    getCurrentTime,
  };
}
