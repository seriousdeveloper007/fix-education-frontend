import { useState, useCallback } from 'react';

export function useChatMessages() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);
  
  const updateLastMessage = useCallback((updateFn) => {
    setMessages(prev => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last) {
        const result = updateFn(last);
        if (result) {
          updated[updated.length - 1] = result;
        }
      }
      return updated;
    });
  }, []);
  
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  return { 
    messages, 
    setMessages, 
    addMessage, 
    updateLastMessage, 
    clearMessages,
    isLoading, 
    setIsLoading 
  };
}