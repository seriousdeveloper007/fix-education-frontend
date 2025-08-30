import { useRef } from 'react';
import { WS_BASE_URL } from '../config/config.js';

export function useChatWebSocket({ onMessage, onToken, getPlaybackTime } = {}) {
  const wsRef = useRef(null);

  const connect = () => {
    if (wsRef.current) return; // avoid reconnecting if already connected

    const tabId = localStorage.getItem('tabId');
    const params = new URLSearchParams({ tabId });

    if (getPlaybackTime) {
      const time = Math.floor(getPlaybackTime());
      params.append('currentPlaybackTime', time);
    }

    const storedChatId = localStorage.getItem('chatId');
    if (storedChatId) {
      params.append('chatId', storedChatId);
    }

    const ws = new WebSocket(`${WS_BASE_URL}/ws/chat?${params.toString()}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.chat_id) {
          localStorage.setItem('chatId', data.chat_id);
        } else if (data.message !== undefined) {
          onMessage?.(data.message);
        } else if (data.token !== undefined) {
          onToken?.(data.token);
        }
      } catch (err) {
        console.error('Invalid websocket message', err);
      }
    };

    ws.onclose = () => {
      console.log('[WebSocket Closed]');
      wsRef.current = null;
    };
  };

  const close = () => {
    wsRef.current?.close();
  };

  const sendMessage = (data) => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const playbackTime = getPlaybackTime ? Math.floor(getPlaybackTime()) : 0;

        // Merge playback time with the data object and send
        wsRef.current.send(JSON.stringify({
          ...data,
          currentPlaybackTime: playbackTime,
        }));
      } else {
        console.warn("WebSocket is not open.");
      }
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
    }
  };

  return { connect, sendMessage, close };
}
