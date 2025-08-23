import { useRef } from 'react';
import { WS_BASE_URL } from '../config.js';

export function useRoadmapWebSocket({ onMessage } = {}) {
  const wsRef = useRef(null);

  const connect = () => {
    if (wsRef.current) return; // avoid reconnecting if already connected

    const ws = new WebSocket(`${WS_BASE_URL}/ws/roadmap`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message !== undefined) {
          onMessage?.(data.message);
        } else {
          onMessage?.(data);
        }
      } catch {
        onMessage?.(event.data);
      }
    };

    ws.onclose = () => {
      console.log('[Roadmap WebSocket Closed]');
      wsRef.current = null;
    };
  };

  const close = () => {
    wsRef.current?.close();
  };

  const sendMessage = (data) => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(data));
      } else {
        console.warn('WebSocket is not open.');
      }
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
    }
  };

  return { connect, sendMessage, close };
}
