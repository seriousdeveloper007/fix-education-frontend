import { useState, useCallback } from 'react';
import { useRoadmapWebSocket } from '../services/RoadmapWebSocket.js';

export function useChatRoadmap() {
  const [messages, setMessages] = useState([]);

  const { connect, sendMessage } = useRoadmapWebSocket({
    onMessage: (msg) => {
      const text = typeof msg === 'string'
        ? msg
        : msg.message || JSON.stringify(msg);
      setMessages((prev) => [...prev, { role: 'agent', text }]);
    },
  });

  const sendUserMessage = useCallback(
    (text) => {
      if (!text) return;
      setMessages((prev) => [...prev, { role: 'user', text }]);
      connect();
      sendMessage({ text, message_type: 'text' });
    },
    [connect, sendMessage]
  );

  return { messages, sendUserMessage };
}
