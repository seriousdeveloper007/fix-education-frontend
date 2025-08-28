import { useState, useCallback, useEffect } from 'react';
import { useRoadmapWebSocket, fetchRoadmapMessages } from '../services/roadmapService.js';

export function useChatRoadMap() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    const loadExistingMessages = async () => {
      const chatId = localStorage.getItem('chatRoadmapId');
      
      if (chatId) {
        setIsLoadingHistory(true);
        try {
          const existingMessages = await fetchRoadmapMessages();
          if (existingMessages.length > 0) {
            setMessages(existingMessages);
          }
        } catch (error) {
          console.error('Failed to load existing messages:', error);
        } finally {
          setIsLoadingHistory(false);
        }
      }
    };

    loadExistingMessages();
  }, []); 


  const handleWebSocketMessage = useCallback((msg) => {
    setIsLoading(false);
  
    // Safely parse JSON if it is JSON; otherwise keep the raw string
    let data = msg;
    if (typeof msg === "string") {
      try { data = JSON.parse(msg); } catch { /* keep as raw string */ }
    }
  
    // 1) ChatID → save & stop
    if (typeof data === "object" && data?.chat_id) {
      try { localStorage.setItem("chatRoadmapId", data.chat_id); } catch {}
      return;
    }

    if(typeof data === "object" && data?.roadmap_id){
      try { localStorage.setItem("roadmapId", data.roadmap_id); } catch {}
    }
  
    // 2) Full message → add as agent
    if (typeof data === "object" && data?.message !== undefined) {
      setMessages(prev => [...prev, { role: "agent", text: String(data.message) }]);
      return;
    }
  
    // 3) Token → stream into agent message
    const token =
      (typeof data === "object" ? data?.token : undefined) ??
      (typeof data === "string" ? data : undefined);
  
    if (token !== undefined) {
      setMessages(prev => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (!last || last.role === "user") {
          next.push({ role: "agent", text: String(token) });
        } else {
          next[next.length - 1] = { ...last, text: String(last.text || "") + String(token) };
        }
        return next;
      });
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
    isLoadingHistory,
    resetChat,
  };
}
