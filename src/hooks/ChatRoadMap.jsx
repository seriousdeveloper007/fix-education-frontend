import { useState, useCallback } from 'react';
import { useRoadmapWebSocket } from '../services/roadmapService.js';

export function useChatRoadMap() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleWebSocketMessage = useCallback((msg) => {
    setIsLoading(false);

    // Persist chat id for subsequent messages
    if (typeof msg === 'object' && msg?.chat_id) {
      try {
        localStorage.setItem('chatRoadmapId', msg.chat_id);
      } catch (e) {
        console.warn('Failed to save chatRoadmapId to localStorage:', e);
      }
      return;
    }

    if (typeof msg === 'object') {
      setMessages((prev) => [...prev, { role: 'agent', text: JSON.stringify(msg) }]);
    } else {
      setMessages((prev) => [...prev, { role: 'agent', text: msg }]);
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

  const resetChat = useCallback(() => {
    setMessages([]);
    setInput('');
    setIsLoading(false);
    try {
      localStorage.removeItem('chatRoadmapId');
    } catch (e) {
      console.warn('Failed to clear chatRoadmapId from localStorage:', e);
    }
  }, []);

  return {
    messages,
    input,
    setInput,
    handleSend,
    isLoading,
    resetChat,
  };
}
