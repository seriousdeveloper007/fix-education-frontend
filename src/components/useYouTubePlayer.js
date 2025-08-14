import { useEffect, useRef, useCallback } from 'react';

export function useYouTubePlayer(videoId, onStateChange) {
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
              
              // Call the callback if provided
              if (onStateChange) {
                onStateChange(event.data);
              }
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

  const getPlayerState = useCallback(() => {
    return playerRef.current?.getPlayerState?.(); // returns -1,0,1,2,3,5
  }, []);

  const getDuration = useCallback(() => {
    const dur = playerRef.current?.getDuration?.();
    if (typeof dur === 'number' && Number.isFinite(dur) && dur > 0) {
      return Math.trunc(dur); // integer seconds
    }
    return null;
  }, []);

  const isPlaying = useCallback(() => {
    const YT = window.YT;
    const state = getPlayerState();
    return YT && state === YT.PlayerState.PLAYING; // 1
  }, [getPlayerState]);

  return {
    iframeRef,
    play,
    pause,
    getCurrentTime,
    isPlaying,
    getDuration
  };
}
