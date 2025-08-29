import { useRef } from 'react';
import { WS_BASE_URL } from '../config/config.js';

export function useRoadmapWebSocket({ onMessage } = {}) {
  const wsRef = useRef(null);

  const connect = () => {
    if (wsRef.current) return; // avoid reconnecting if already connected

    const ws = new WebSocket(`${WS_BASE_URL}/ws/roadmap`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Save chat_id as chatRoadmapId if sent from backend
        if (data?.chat_id) {
          try {
            localStorage.setItem('chatRoadmapId', data.chat_id);
          } catch (e) {
            console.warn('Failed to save chatRoadmapId to localStorage:', e);
          }
          return;
        }

        // Handle message content - backend sends { "message": "text content" }
        if (data.token !== undefined) {
          onMessage?.(data.token);
        } else {
          onMessage?.(data);
        }
      } catch (error) {
        console.warn('Failed to parse WebSocket message:', error);
        // If parsing fails, send the raw string
        onMessage?.(event.data);
      }
    };

    ws.onopen = () => {
      console.log('[Roadmap WebSocket Connected]');
    };

    ws.onclose = () => {
      console.log('[Roadmap WebSocket Closed]');
      wsRef.current = null;
    };

    ws.onerror = (error) => {
      console.error('[Roadmap WebSocket Error]:', error);
    };
  };

  const close = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const sendMessage = (data) => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const chatRoadmapId = localStorage.getItem('chatRoadmapId');
        const payload = chatRoadmapId
          ? { ...data, chat_id: parseInt(chatRoadmapId, 10) }
          : data;

        wsRef.current.send(JSON.stringify(payload));
      } else {
        console.warn('WebSocket is not open. Ready state:', wsRef.current?.readyState);
      }
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
    }
  };

  return { connect, sendMessage, close };
}