import { useState, useRef, useCallback } from 'react';
import { useRoadmapWebSocket } from '../services/roadmapService.js';

export function useChatRoadMap() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messageContainerRef = useRef(null);

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

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsLoading(true);

    if (!hasStarted) {
      connect();
      setHasStarted(true);
    }

    sendMessage({ text, message_type: 'text' });
  }, [input, connect, sendMessage, hasStarted]);

  return {
    messages,
    input,
    setInput,
    handleSend,
    isLoading,
    hasStarted,
    messageContainerRef,
  };
}
