import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WS_BASE_URL } from '../config';
import {
  getStoredMiniLessonDiscussionChatId,
  storeMiniLessonDiscussionChatId,
  fetchMiniLessonDiscussionMessages,
} from '../services/miniLessonDiscussionService';

function sanitizeMessage(message) {
  if (!message || typeof message !== 'object') return null;
  const safe = { ...message };
  if (!safe.message_from && typeof safe.role === 'string') {
    if (safe.role === 'assistant') safe.message_from = 'assistant';
    else if (safe.role === 'user') safe.message_from = 'user';
  }
  if (!safe.message_from) {
    safe.message_from = 'assistant';
  }
  return safe;
}

export function useMiniLessonDiscussion({ miniLessonId }) {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(() => getStoredMiniLessonDiscussionChatId(miniLessonId));
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const socketRef = useRef(null);
  const firstSendAfterOpenRef = useRef(false);
  const lastHandshakeKeyRef = useRef(null);
  const userIdRef = useRef(null);

  const resolvedUrl = useMemo(() => {
    if (!miniLessonId) return null;
    return `${WS_BASE_URL}/ws/mini-lesson-discussion`;
  }, [miniLessonId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('user');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id != null) {
        userIdRef.current = parsed.id;
      }
    } catch {
      userIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    const stored = getStoredMiniLessonDiscussionChatId(miniLessonId);
    setChatId(stored ?? null);
    setMessages([]);
    setIsAwaitingResponse(false);
    setIsLoadingHistory(false);
    lastHandshakeKeyRef.current = null;

    const socket = socketRef.current;
    if (socket) {
      if (typeof socket.close === 'function') {
        socket.close();
      }
      socketRef.current = null;
      setIsConnected(false);
    }
    firstSendAfterOpenRef.current = false;
  }, [miniLessonId]);

  useEffect(() => {
    if (chatId && miniLessonId) {
      storeMiniLessonDiscussionChatId(chatId, miniLessonId);
    }
  }, [chatId, miniLessonId]);

  const closeSocket = useCallback(() => {
    const socket = socketRef.current;
    if (socket && typeof socket.close === 'function') {
      socket.close();
    }
    socketRef.current = null;
    setIsConnected(false);
    setIsConnecting(false);
    setIsAwaitingResponse(false);
    setIsLoadingHistory(false);
  }, []);

  useEffect(() => () => {
    closeSocket();
  }, [closeSocket]);

  const handleIncomingData = useCallback((data) => {
    if (!data || typeof data !== 'object') return;

    if (data.chat_id != null) {
      const incomingChatId = String(data.chat_id);
      storeMiniLessonDiscussionChatId(incomingChatId, miniLessonId);
      setChatId((prev) => (prev === incomingChatId ? prev : incomingChatId));
    }

    if (Array.isArray(data.messages) && data.messages.length > 0) {
      const sanitized = data.messages
        .map((item) => sanitizeMessage(item))
        .filter(Boolean);
      if (sanitized.length > 0) {
        setMessages(sanitized);
      }
      setIsAwaitingResponse(false);
    }

    const token = data.token;
    if (typeof token === 'string' && token) {
      setMessages((prev) => {
        if (prev.length === 0 || prev[prev.length - 1].message_from === 'user') {
          return [...prev, { message_from: 'assistant', text: token }];
        }
        const next = [...prev];
        const last = next[next.length - 1] || {};
        next[next.length - 1] = {
          ...last,
          text: `${last.text || ''}${token}`,
        };
        return next;
      });
      setIsAwaitingResponse(false);
    }

    const message = data.message;
    if (message && typeof message === 'object') {
      const normalized = sanitizeMessage(message);
      if (normalized) {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (
            normalized.message_from === 'assistant' &&
            normalized.text &&
            last &&
            last.message_from === 'assistant'
          ) {
            next[next.length - 1] = {
              ...last,
              text: `${last.text || ''}${normalized.text}`,
            };
            return next;
          }
          next.push(normalized);
          return next;
        });
      }
      setIsAwaitingResponse(false);
    }

    if (typeof data.error === 'string' && data.error) {
      setMessages((prev) => [
        ...prev,
        { message_from: 'assistant', text: data.error },
      ]);
      setIsAwaitingResponse(false);
    }
  }, [miniLessonId]);

  const connect = useCallback(() => {
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
        const handleError = (event) => {
          cleanup();
          reject(event);
        };
        const cleanup = () => {
          if (typeof existing.removeEventListener === 'function') {
            existing.removeEventListener('open', handleOpen);
            existing.removeEventListener('error', handleError);
          }
        };
        existing.addEventListener('open', handleOpen);
        existing.addEventListener('error', handleError);
      });
    }

    if (!resolvedUrl) {
      return Promise.reject(new Error('Missing WebSocket endpoint.'));
    }

    setIsConnecting(true);

    const socket = new WebSocket(resolvedUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnecting(false);
      setIsConnected(true);
      firstSendAfterOpenRef.current = true;
    };

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        handleIncomingData(parsed);
      } catch {
        return;
      }
    };

    socket.onerror = () => {
      setIsConnected(false);
      setIsAwaitingResponse(false);
      setIsConnecting(false);
    };

    socket.onclose = () => {
      setIsConnected(false);
      setIsConnecting(false);
      firstSendAfterOpenRef.current = false;
      lastHandshakeKeyRef.current = null;
    };

    return new Promise((resolve, reject) => {
      const handleOpen = () => {
        cleanup();
        resolve(socket);
      };
      const handleError = (event) => {
        cleanup();
        reject(event);
      };
      const cleanup = () => {
        if (typeof socket.removeEventListener === 'function') {
          socket.removeEventListener('open', handleOpen);
          socket.removeEventListener('error', handleError);
        }
      };
      socket.addEventListener('open', handleOpen);
      socket.addEventListener('error', handleError);
    });
  }, [handleIncomingData, resolvedUrl]);

  const sendHandshake = useCallback((socketInstance, currentChatId) => {
    if (!socketInstance || socketInstance.readyState !== WebSocket.OPEN) return;
    if (!miniLessonId) return;

    const key = `${miniLessonId}:${currentChatId || ''}`;
    if (lastHandshakeKeyRef.current === key) return;

    const payload = { mini_lesson_id: miniLessonId };
    if (currentChatId) {
      payload.chat_id = currentChatId;
    }
    if (userIdRef.current != null) {
      payload.user_id = userIdRef.current;
    }

    try {
      socketInstance.send(JSON.stringify(payload));
      lastHandshakeKeyRef.current = key;
    } catch {
      lastHandshakeKeyRef.current = null;
    }
  }, [miniLessonId]);

  useEffect(() => {
    if (!miniLessonId) return;

    let cancelled = false;
    (async () => {
      try {
        const socket = await connect();
        if (cancelled) return;
        if (!chatId) {
          sendHandshake(socket, chatId);
        }
      } catch {
        return;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chatId, connect, miniLessonId, sendHandshake]);

  useEffect(() => {
    if (!chatId) return;

    let cancelled = false;
    setIsLoadingHistory(true);
    setMessages([]);

    (async () => {
      try {
        const history = await fetchMiniLessonDiscussionMessages(chatId);
        if (cancelled) return;
        if (history.length > 0) {
          const sanitized = history.map((item) => sanitizeMessage(item)).filter(Boolean);
          setMessages(sanitized);
        } else {
          setMessages([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingHistory(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      setIsLoadingHistory(false);
    };
  }, [chatId]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || !miniLessonId) return false;

    const userMessage = { message_from: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setIsAwaitingResponse(true);

    const payload = { mini_lesson_id: miniLessonId, text: trimmed };
    const activeChatId = chatId || getStoredMiniLessonDiscussionChatId(miniLessonId);
    if (activeChatId) {
      payload.chat_id = activeChatId;
    }
    if (userIdRef.current != null) {
      payload.user_id = userIdRef.current;
    }

    try {
      const socket = await connect();
      if (firstSendAfterOpenRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        firstSendAfterOpenRef.current = false;
      }
      socket.send(JSON.stringify(payload));
      if (activeChatId) {
        storeMiniLessonDiscussionChatId(activeChatId, miniLessonId);
      }
      return true;
    } catch {
      setIsAwaitingResponse(false);
      setMessages((prev) => [
        ...prev,
        { message_from: 'assistant', text: 'Unable to send your message. Please try again.' },
      ]);
      return false;
    }
  }, [chatId, connect, miniLessonId]);

  return {
    messages,
    chatId,
    isConnecting,
    isConnected,
    isAwaitingResponse,
    isLoadingHistory,
    sendMessage,
  };
}
