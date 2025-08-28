import { useState, useCallback } from 'react';
import { useRoadmapWebSocket } from '../services/roadmapService.js';

export function useChatRoadMap() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleWebSocketMessage = useCallback((msg) => {
    setIsLoading(false);
    if (typeof msg === 'object') {
      setMessages(prev => [...prev, { role: 'agent', text: JSON.stringify(msg) }]);
    } else {
      setMessages(prev => [...prev, { role: 'agent', text: msg }]);
    }
  }, []);

  const { connect, sendMessage } = useRoadmapWebSocket({
    onMessage: handleWebSocketMessage,
  });

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    setIsLoading(true);

    if (messages.length === 0) {
      // first message → wait 3s
      connect();
      setTimeout(() => {
        sendMessage({ text, message_type: 'text' });
      }, 3000);
    } else {
      // subsequent messages → send immediately
      sendMessage({ text, message_type: 'text' });
    }
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
  }, [input, messages, connect, sendMessage]);

  return {
    messages,
    input,
    setInput,
    handleSend,
    isLoading,
  };
}
