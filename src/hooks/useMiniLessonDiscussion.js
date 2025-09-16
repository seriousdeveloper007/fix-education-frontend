import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WS_BASE_URL } from '../config';
import { fetchChatMessages } from '../services/chatService';

const STORAGE_KEY = 'chatDiscussionID';
const TEN_MINUTES_MS = 10 * 60 * 1000;
const CONNECTION_DELAY_MS = 2000; // 2 second delay to check for existing messages

// Local storage utilities (unchanged)
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

export function useChatDiscussion({ miniLessonId }) {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(() => getStoredChatDiscussionId());
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Connection control states
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [hasExistingMessages, setHasExistingMessages] = useState(false);

  const socketRef = useRef(null);
  const firstSendAfterOpenRef = useRef(false);
  const lastHandshakeKeyRef = useRef(null);
  const userIdRef = useRef(null);
  const connectionTimeoutRef = useRef(null);

  const resolvedUrl = useMemo(() => {
    return `${WS_BASE_URL}/ws/mini-lesson-discussion`;
  }, []);

  // Get user ID from localStorage
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

  // Reset everything on mount/unmount
  useEffect(() => {
    const stored = getStoredChatDiscussionId();
    setChatId(stored ?? null);
    setMessages([]);
    setIsAwaitingResponse(false);
    setHasUserInteracted(false);
    setInitialLoadComplete(false);
    setHasExistingMessages(false);
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

    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, []);

  // Store chatId when it changes
  useEffect(() => {
    if (chatId) {
      storeChatDiscussionId(chatId);
    }
  }, [chatId]);

  const loadExistingMessages = useCallback(async (providedChatId) => {
    const activeChatId = providedChatId || getStoredChatDiscussionId();
    if (!activeChatId) {
      setInitialLoadComplete(true);
      return;
    }

    const normalizedChatId = String(activeChatId);

    setIsLoadingHistory(true);
    try {
      const data = await fetchChatMessages(normalizedChatId);
      if (Array.isArray(data)) {
        const sanitized = data
          .map((item) => sanitizeMessage(item))
          .filter(Boolean);

        if (sanitized.length > 0) {
          setMessages(sanitized);
          setHasExistingMessages(true);
        }
      }
    } catch {
      // Ignore fetch errors and keep existing messages
    } finally {
      setIsLoadingHistory(false);
      setInitialLoadComplete(true);
    }
  }, []);

  // Load existing messages on mount
  useEffect(() => {
    const storedChatId = chatId || getStoredChatDiscussionId();
    if (storedChatId) {
      loadExistingMessages(storedChatId);
    } else {
      setInitialLoadComplete(true);
    }
  }, [chatId, loadExistingMessages]);

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

    const key = `chat:${currentChatId || ''}:lesson:${miniLessonId || ''}`;
    if (lastHandshakeKeyRef.current === key) return;

    const payload = {
      mini_lesson_id: miniLessonId,
    };
    
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

  // Timer-based connection logic
  useEffect(() => {
    if (!initialLoadComplete) return;

    // Clear any existing timeout
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }

    // If user has interacted, connect immediately
    if (hasUserInteracted) {
      let cancelled = false;
      (async () => {
        try {
          const socket = await connect();
          if (cancelled) return;
          sendHandshake(socket, chatId);
        } catch {
          return;
        }
      })();

      return () => {
        cancelled = true;
      };
    }

    // If no existing messages, connect after a short delay
    if (!hasExistingMessages) {
      connectionTimeoutRef.current = setTimeout(() => {
        let cancelled = false;
        (async () => {
          try {
            const socket = await connect();
            if (cancelled) return;
            sendHandshake(socket, chatId);
          } catch {
            return;
          }
        })();

        return () => {
          cancelled = true;
        };
      }, CONNECTION_DELAY_MS);
    }

    // If has existing messages, don't connect until user interacts
    // (handled by the hasUserInteracted case above)

  }, [initialLoadComplete, hasExistingMessages, hasUserInteracted, chatId, connect, sendHandshake]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return false;

    // Mark that user has interacted
    setHasUserInteracted(true);

    const userMessage = { message_from: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setIsAwaitingResponse(true);

    const payload = {
      text: trimmed,
      mini_lesson_id: miniLessonId,
    };
    
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
  }, [chatId, connect, miniLessonId]);

  const handleClearChatDiscussionId = useCallback(() => {
    clearChatDiscussionId();
    setChatId(null);
    setMessages([]);
    setIsAwaitingResponse(false);
    setIsLoadingHistory(false);
    setHasUserInteracted(false);
    setInitialLoadComplete(false);
    setHasExistingMessages(false);
    
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
  }, []);

  return {
    messages,
    chatId,
    isConnecting,
    isConnected,
    isAwaitingResponse,
    isLoadingHistory,
    sendMessage,
    clearChatDiscussionId: handleClearChatDiscussionId,
    // Debug states
    hasUserInteracted,
    initialLoadComplete,
    hasExistingMessages,
  };
}

export const useMiniLessonDiscussion = useChatDiscussion;