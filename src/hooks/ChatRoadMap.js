import { useState, useCallback, useEffect } from 'react';
import {
  useRoadmapWebSocket,
  fetchRoadmapMessages,
  fetchRoadmapAnalysis,
  updateRoadmap,
  deleteRoadmap
} from '../services/roadmapService.js';

export function useChatRoadMap() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [nextWeekTopics, setNextWeekTopics] = useState(null);
  const [roadmapTitle, setRoadmapTitle] = useState('');

  useEffect(() => {
    const loadExistingMessages = async () => {
      setIsLoadingHistory(true);
      try {
        // First, get the roadmap analysis
        const analysis = await fetchRoadmapAnalysis();
        
        let existingMessages = [];
        
        if (analysis) {
          // If analysis exists, use its chat_id to fetch messages
          localStorage.setItem('roadmapId', analysis.id);
          localStorage.setItem('chatRoadmapId', analysis.chat_id);
          setRoadmapTitle(analysis.title || '');
          
          const { id: userId } = JSON.parse(localStorage.getItem('user') || '{}');
          if ((analysis.user_id === null || analysis.user_id === undefined) && userId) {
            await updateRoadmap({ user_id: userId });
          }
          
          // Fetch messages using the chat_id from analysis
          existingMessages = await fetchRoadmapMessages();
        } else {
          // If no analysis, check if we have an existing chatId in localStorage
          const chatId = localStorage.getItem('chatRoadmapId');
          if (chatId) {
            existingMessages = await fetchRoadmapMessages();
          }
        }

        const merged = [...existingMessages];
        
        // Add roadmap analysis to messages if we have enough messages
        if (analysis && existingMessages.length >= 10 && (existingMessages.length - 10) % 4 === 0) {
          merged.push({ role: 'agent', kind: 'roadmap', payload: analysis });
        }
        
        if (merged.length > 0) {
          setMessages(merged);
        }
      } catch (error) {
        console.error('Failed to load existing messages:', error);
      } finally {
        setIsLoadingHistory(false);
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
      try { localStorage.setItem("chatRoadmapId", data.chat_id); } catch { /* ignore */ }
      return;
    }

    if (typeof data === "object" && data?.next_week_topics) {
      setNextWeekTopics(data.next_week_topics);
      return;
    }

    if(typeof data === "object" && data?.roadmap_id){
      try {
        localStorage.setItem("roadmapId", data.roadmap_id);
        const { id: userId } = JSON.parse(localStorage.getItem('user') || '{}');
        if ((data.roadmap?.user_id === null || data.roadmap?.user_id === undefined) && userId) {
          updateRoadmap({ user_id: userId });
        }
        if (data.roadmap?.title) {
          setRoadmapTitle(data.roadmap.title);
        }
        setMessages(prev => [
          ...prev,
          {
            role: "agent",
            kind: "roadmap",
            payload: data.roadmap,
          }
        ]);
      } catch { /* ignore */ }
    }
  
    // 2) Full message → add as agent
    if (typeof data === "object" && data?.message !== undefined) {
      setMessages(prev => [...prev, { role: "agent", kind: "text", text: String(data.message) }]);
      setIsLoading(true);
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
          next.push({ role: "agent", kind: "text", text: String(token) });
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

  const handleCreateRoadmap = useCallback(() => {
    const text = 'create roadmap';
    setIsLoading(true);
    sendMessage({ text, message_type: 'text' });
    setMessages(prev => [...prev, { role: 'user', text }]);
  }, [sendMessage]);

  const resetChat = useCallback(async () => {
    setMessages([]);
    setInput('');
    setIsLoading(false);
    setNextWeekTopics(null);
    setRoadmapTitle('');
    const roadmapId = localStorage.getItem('roadmapId');
    if (roadmapId) {
      try {
        await deleteRoadmap(roadmapId);
      } catch (e) {
        console.error('Failed to delete roadmap:', e);
      }
      try {
        localStorage.removeItem('roadmapId');
      } catch (e) {
        console.warn('Failed to clear roadmapId from localStorage:', e);
      }
    }
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
    handleCreateRoadmap,
    isLoading,
    isLoadingHistory,
    resetChat,
    nextWeekTopics,
    roadmapTitle,
  };
}

