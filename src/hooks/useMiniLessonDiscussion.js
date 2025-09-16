import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WS_BASE_URL } from '../config';

const STORAGE_KEY = 'chatDiscussionID';
const TEN_MINUTES_MS = 10 * 60 * 1000;

// Local storage utilities
function readStorage() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(record) {
  if (typeof window === 'undefined') return;
  try {
    if (!record) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    return;
  }
}

function clearChatDiscussionId() {
  writeStorage(null);
}

function storeChatDiscussionId(chatId) {
  if (!chatId) {
    clearChatDiscussionId();
    return;
  }

  const record = {
    id: String(chatId),
    expiresAt: Date.now() + TEN_MINUTES_MS,
  };

  writeStorage(record);
}

function getStoredChatDiscussionId() {
  const record = readStorage();
  if (!record) return null;

  if (typeof record.expiresAt === 'number' && record.expiresAt > 0) {
    if (record.expiresAt < Date.now()) {
      clearChatDiscussionId();
      return null;
    }
  }

  if (!record.id) {
    clearChatDiscussionId();
    return null;
  }

  return String(record.id);
}

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

export function useChatDiscussion() {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(() => getStoredChatDiscussionId());
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

  const socketRef = useRef(null);
  const firstSendAfterOpenRef = useRef(false);
  const lastHandshakeKeyRef = useRef(null);
  const userIdRef = useRef(null);

  const resolvedUrl = useMemo(() => {
    return `${WS_BASE_URL}/ws/chat-discussion`;
  }, []);

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
    const stored = getStoredChatDiscussionId();
    setChatId(stored ?? null);
    setMessages([]);
    setIsAwaitingResponse(false);
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
  }, []);

  useEffect(() => {
    if (chatId) {
      storeChatDiscussionId(chatId);
    }
  }, [chatId]);

  const closeSocket = useCallback(() => {
    const socket = socketRef.current;
    if (socket && typeof socket.close === 'function') {
      socket.close();
    }
    socketRef.current = null;
    setIsConnected(false);
    setIsConnecting(false);
    setIsAwaitingResponse(false);
  }, []);

  useEffect(() => () => {
    closeSocket();
  }, [closeSocket]);

  const handleIncomingData = useCallback((data) => {
    if (!data || typeof data !== 'object') return;

    if (data.chat_id != null) {
      const incomingChatId = String(data.chat_id);
      storeChatDiscussionId(incomingChatId);
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
  }, []);

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

    const key = `chat:${currentChatId || ''}`;
    if (lastHandshakeKeyRef.current === key) return;

    const payload = {};
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
  }, []);

  useEffect(() => {
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
  }, [chatId, connect, sendHandshake]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return false;

    const userMessage = { message_from: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setIsAwaitingResponse(true);

    const payload = { text: trimmed };
    const activeChatId = chatId || getStoredChatDiscussionId();
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
        storeChatDiscussionId(activeChatId);
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
  }, [chatId, connect]);

  return {
    messages,
    chatId,
    isConnecting,
    isConnected,
    isAwaitingResponse,
    sendMessage,
    clearChatDiscussionId,
  };
}