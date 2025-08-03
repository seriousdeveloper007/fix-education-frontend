import { useEffect, useRef } from 'react';

export function useChatWebSocket(tabId, { onMessage, onToken, onChatId } = {}) {
  const wsRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams({ tab_id: tabId });
    const storedChatId = localStorage.getItem('chat_id');
    if (storedChatId) {
      params.append('chat_id', storedChatId);
    }

    const ws = new WebSocket(`ws://localhost:8000/ws/chat?${params.toString()}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.chat_id) {
          localStorage.setItem('chat_id', data.chat_id);
          if (onChatId) onChatId(data.chat_id);
        } else if (data.message !== undefined) {
          if (onMessage) onMessage(data.message);
        } else if (data.token !== undefined) {
          if (onToken) onToken(data.token);
        }
      } catch (err) {
        console.error('Invalid websocket message', err);
      }
    };

    return () => {
      ws.close();
    };
  }, [tabId, onMessage, onToken, onChatId]);

  const sendMessage = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message }));
    }
  };

  return { sendMessage };
}
