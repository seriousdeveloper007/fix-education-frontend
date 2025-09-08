import { useCallback, useEffect, useRef, useState } from 'react';
import { WS_BASE_URL } from '../config';
import { fetchStartLearningChatMessages } from '../services/chatService';

export function useStartLearning() {
  const socketRef = useRef(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const firstSendAfterOpenRef = useRef(false);
  const lastOpenedAtRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

  const resolvedUrl = `${WS_BASE_URL}/ws/learning-started`;

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
          try { existing.removeEventListener('open', handleOpen); } catch (_) {}
          try { existing.removeEventListener('error', handleError); } catch (_) {}
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
          try { localStorage.setItem('chatStartLearningId', String(data.chat_id)); } catch (_) {}
        }

        // Special case: direct first few lesson recommendations payload
        const firstFewLessons = data?.first_few_recommended_lessons;
        if (firstFewLessons) {
          setMessages((prev) => [...prev, { role: 'assistant', type: 'first_recommendation', payload: firstFewLessons }]);
          setIsAwaitingResponse(false);
          return;
        }

        // Special case: first few lesson recommendation message
        const messageType = data?.message_type;
        const hasNoText = !(typeof data?.message === 'string' && data.message.trim() !== '');
        if (messageType === 'first_few_lesson_recommendation' && hasNoText && data?.payload) {
          setMessages((prev) => [...prev, { role: 'assistant', type: 'first_recommendation', payload: data.payload }]);
          setIsAwaitingResponse(false);
          return;
        }

        const token = data?.token;
        if (typeof token === 'string') {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (!last || last.role === 'user') {
              next.push({ role: 'assistant', text: token });
            } else {
              next[next.length - 1] = { ...last, text: String((last.text ?? '')) + token };
            }
            return next;
          });
          setIsAwaitingResponse(false);
          return;
        }

        const assistantText = typeof data?.message === 'string' ? data.message : null;
        if (assistantText) {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (!last || last.role === 'user') {
              next.push({ role: 'assistant', text: String(assistantText) });
            } else {
              next[next.length - 1] = { ...last, text: String((last.text ?? '')) + String(assistantText) };
            }
            return next;
          });
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
        try { socket.removeEventListener('open', handleOpen); } catch (_) {}
        try { socket.removeEventListener('error', handleError); } catch (_) {}
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
        try { socket.close(); } catch (_) {}
      }
      socketRef.current = null;
    };
  }, []);

  // Fetch existing messages if a chat is already present in localStorage
  const fetchExistingMessages = useCallback(async () => {
    let chatIdFromStorage = null;
    try {
      const raw = localStorage.getItem('chatStartLearningId');
      if (raw != null && String(raw).trim() !== '') {
        chatIdFromStorage = String(raw).trim();
      }
    } catch (_) {}

    if (!chatIdFromStorage) return;

    try {
      const data = await fetchStartLearningChatMessages(chatIdFromStorage);
      if (!Array.isArray(data)) return;
      const mapped = data
        .map((m) => {
          const role = m?.message_from === 'user' ? 'user' : 'assistant';
          const text = m?.text ?? '';
          const type = m?.message_type;
          const payload = m?.payload;
          const firstFewLessons = m?.first_few_recommended_lessons;

          // Special case to surface FirstRecommendation view (new payload shape)
          if (firstFewLessons) {
            return { role: 'assistant', type: 'first_recommendation', payload: firstFewLessons };
          }

          // Special case to surface FirstRecommendation view (legacy shape)
          const hasNoText = !(typeof text === 'string' && text.trim() !== '');
          if (type === 'first_few_lesson_recommendation' && hasNoText && payload) {
            return { role: 'assistant', type: 'first_recommendation', payload };
          }

          if (typeof text !== 'string' || text.trim() === '') return null;
          return { role, text: String(text) };
        })
        .filter(Boolean);
      if (mapped.length > 0) {
        setMessages(mapped);
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
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setIsAwaitingResponse(true);

    let chatIdFromStorage = null;
    try {
      const raw = localStorage.getItem('chatStartLearningId');
      if (raw != null && String(raw).trim() !== '') {
        chatIdFromStorage = String(raw).trim();
      }
    } catch (_) {}

    let userIdFromStorage = null;
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        if (userObj && userObj.id != null) {
          userIdFromStorage = String(userObj.id);
        }
      }
    } catch (_) {}

    const payloadObj = chatIdFromStorage
      ? (userIdFromStorage ? { chat_id: chatIdFromStorage, user_id: userIdFromStorage, text: trimmed } : { chat_id: chatIdFromStorage, text: trimmed })
      : { text: trimmed };
    const payload = JSON.stringify(payloadObj);

    const send = (socket) => {
      try { socket.send(payload); } catch (_) {}
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
      try { socket.close(); } catch (_) {}
    }
    socketRef.current = null;
    setMessages([]);
    setIsAwaitingResponse(false);
    try { localStorage.removeItem('chatStartLearningId'); } catch (_) {}
  }, []);

  return {
    isConnecting,
    isConnected,
    messages,
    isAwaitingResponse,
    startLearning,
    reset,
  };
} 