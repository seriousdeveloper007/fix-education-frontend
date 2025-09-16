import { useCallback, useEffect, useRef, useState } from 'react';
import { WS_BASE_URL } from '../config';
import { fetchChatMessages } from '../services/chatService';
import { fetchRoadmap } from '../services/roadmapService';

export function useStartLearning() {
  const socketRef = useRef(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const firstSendAfterOpenRef = useRef(false);
  const lastOpenedAtRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [roadmapStatus, setRoadmapStatus] = useState("checking")
  const [roadmapData, setRoadmapData] = useState(null)

  const resolvedUrl = `${WS_BASE_URL}/ws/learning-started`;

  const RoadmapStatusCheck = useCallback(async () => {
    console.log("checking roadmap");

    let userIdFromStorage = null;

    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        if (userObj && userObj.id != null) {
          userIdFromStorage = userObj.id;
        }
      }

      // Only proceed if we have a valid user ID
      if (userIdFromStorage) {
        const data = await fetchRoadmap({ user_id: userIdFromStorage });

        if (data) {
          console.log("roadmap data", data)
          setRoadmapData(data)
          setRoadmapStatus("present");
        }
        else {
          setRoadmapStatus("none");
        }
      }
      else {
        setRoadmapStatus("none");
      }

    } catch (error) {
      console.error("Error checking roadmap:", error);
      setRoadmapStatus("none");
    }
  }, []);

  const connectIfNeeded = useCallback(() => {
    const existing = socketRef.current;
    if (existing && (existing.readyState === WebSocket.OPEN || existing.readyState === WebSocket.CONNECTING)) {
      if (existing.readyState === WebSocket.OPEN) {
        return Promise.resolve(existing);
      }
      return new Promise((resolve, reject) => {
        const handleOpen = () => {
          cleanup();
          resolve(existing);
        };
        const handleError = (err) => {
          cleanup();
          reject(err);
        };
        const cleanup = () => {
          try { existing.removeEventListener('open', handleOpen); } catch (_) { }
          try { existing.removeEventListener('error', handleError); } catch (_) { }
        };
        existing.addEventListener('open', handleOpen);
        existing.addEventListener('error', handleError);
      });
    }

    if (!resolvedUrl) return Promise.reject(new Error('No WebSocket URL'));

    setIsConnecting(true);

    const socket = new WebSocket(resolvedUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnecting(false);
      setIsConnected(true);
      lastOpenedAtRef.current = Date.now();
      firstSendAfterOpenRef.current = true;
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.chat_id) {
          try { localStorage.setItem('chatStartLearningId', String(data.chat_id)); } catch (_) { }
        }

        // Handle token messages (streaming)
        const token = data?.token;
        if (typeof token === 'string') {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (!last || last.message_from === 'user') {
              next.push({ message_from: 'assistant', text: token });
            } else {
              next[next.length - 1] = { ...last, text: String((last.text ?? '')) + token };
            }
            return next;
          });
          setIsAwaitingResponse(false);
          return;
        }

        // Handle message with type checking
        const message = data?.message;
        if (message && typeof message === 'object') {
          if (message.message_type === 'roadmap_recommended') {
            // Pass the complete message object for roadmap recommendation
            setMessages((prev) => [...prev, {
              message_from: 'assistant',
              ...message // Spread the entire message object
            }]);
          } else {
            // Handle normal text messages
            const assistantText = message.text || '';
            if (assistantText) {
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (!last || last.message_from === 'user') {
                  next.push({ message_from: 'assistant', text: String(assistantText) });
                } else {
                  next[next.length - 1] = { ...last, text: String((last.text ?? '')) + String(assistantText) };
                }
                return next;
              });
            }
          }
          setIsAwaitingResponse(false);
        }
      } catch (_) {
        // ignore non-JSON messages
      }
    };

    socket.onerror = () => {
      setIsConnected(false);
      setIsAwaitingResponse(false);
    };

    socket.onclose = () => {
      setIsConnected(false);
      setIsConnecting(false);
    };

    return new Promise((resolve, reject) => {
      const handleOpen = () => {
        cleanup();
        resolve(socket);
      };
      const handleError = (err) => {
        cleanup();
        reject(err);
      };
      const cleanup = () => {
        try { socket.removeEventListener('open', handleOpen); } catch (_) { }
        try { socket.removeEventListener('error', handleError); } catch (_) { }
      };
      socket.addEventListener('open', handleOpen);
      socket.addEventListener('error', handleError);
    });
  }, [resolvedUrl]);

  // Ensure proper cleanup on unmount
  useEffect(() => {
    return () => {
      const socket = socketRef.current;
      if (socket) {
        try { socket.close(); } catch (_) { }
      }
      socketRef.current = null;
    };
  }, []);

  const fetchExistingMessages = useCallback(async () => {
    let chatIdFromStorage = null;
    try {
      const raw = localStorage.getItem('chatStartLearningId');
      if (raw != null && String(raw).trim() !== '') {
        chatIdFromStorage = String(raw).trim();
      }
    } catch (_) { }

    if (!chatIdFromStorage) return;

    try {
      const data = await fetchChatMessages(chatIdFromStorage);
      if (!Array.isArray(data)) return;
      
      // Just pass the messages through as-is, let the components handle display logic
      const validMessages = data.filter(m => m && typeof m === 'object');
      
      if (validMessages.length > 0) {
        setMessages(validMessages);
      }
    } catch (_) {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchExistingMessages();
  }, [fetchExistingMessages]);


  const startLearning = useCallback((text) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return;

    // Push the user message immediately and show loading
    setMessages((prev) => [...prev, { message_from: 'user', text: trimmed }]);
    setIsAwaitingResponse(true);

    let chatIdFromStorage = null;
    try {
      const raw = localStorage.getItem('chatStartLearningId');
      if (raw != null && String(raw).trim() !== '') {
        chatIdFromStorage = String(raw).trim();
      }
    } catch (_) { }

    let userIdFromStorage = null;
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        if (userObj && userObj.id != null) {
          userIdFromStorage = String(userObj.id);
        }
      }
    } catch (_) { }
    const payloadObj = { text: trimmed };

    if (chatIdFromStorage) {
      payloadObj.chat_id = chatIdFromStorage;
    }

    if (userIdFromStorage) {
      payloadObj.user_id = userIdFromStorage;
    }

    const payload = JSON.stringify(payloadObj);

    const send = (socket) => {
      try { 
        socket.send(payload); 
      } catch (_) { }
    };

    (async () => {
      try {
        const socket = await connectIfNeeded();
        if (firstSendAfterOpenRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          firstSendAfterOpenRef.current = false;
        }
        send(socket);
      } catch (_) {
        // If we couldn't send or connect, stop showing loading
        setIsAwaitingResponse(false);
      }
    })();
  }, [connectIfNeeded]);

  const reset = useCallback(() => {
    const socket = socketRef.current;
    if (socket) {
      try { socket.close(); } catch (_) { }
    }
    socketRef.current = null;
    setMessages([]);
    setIsAwaitingResponse(false);
    try { localStorage.removeItem('chatStartLearningId'); } catch (_) { }
  }, []);

  return {
    isConnecting,
    isConnected,
    messages,
    isAwaitingResponse,
    startLearning,
    reset,
    RoadmapStatusCheck,
    roadmapStatus,
    roadmapData
  };
}