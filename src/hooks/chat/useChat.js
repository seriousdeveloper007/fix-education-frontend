import { useEffect, useCallback, useRef } from 'react';
import { useChatMessages } from './useChatMessages';
import { useChatInput } from './useChatInput';
import { useChatConnection } from './useChatConnection';
import { useChatHistory } from './useChatHistory';
import analytics from '../../services/posthogService';

export function useChat({ getCurrentTime }) {
  const hasConnectedRef = useRef(false);
  
  // State management hooks
  const { 
    messages, 
    setMessages, 
    addMessage, 
    updateLastMessage, 
    isLoading, 
    setIsLoading 
  } = useChatMessages();
  
  const { 
    input, 
    setInput,
    attachedImages, 
    setAttachedImages,
    error,
    showError,
    handlePaste,
    removeImage,
    clearInput 
  } = useChatInput();
  
  // WebSocket connection
  const { 
    connect, 
    sendMessage, 
    close 
  } = useChatConnection({
    onMessage: (msg) => {
      setIsLoading(false);
      
      let parsed = msg;
      try {
        parsed = typeof msg === 'string' ? JSON.parse(msg) : msg;
      } catch {
        parsed = { text: String(msg), images: [] };
      }
      
      const role = parsed.role === 'assistant' ? 'agent' : parsed.role || 'agent';
      addMessage({ role, text: parsed.text ?? '', images: parsed.images ?? [] });
    },
    onToken: (token) => {
      setIsLoading(false);
      updateLastMessage((last) => {
        if (!last || last.role === 'user') {
          addMessage({ role: 'agent', text: token, images: [] });
          return null;
        }
        return { ...last, text: (last.text || '') + token };
      });
    },
    getPlaybackTime: getCurrentTime
  });
  
  // Load chat history
  const { loadHistory } = useChatHistory();
  
  useEffect(() => {
    loadHistory().then(loadedMessages => {
      if (loadedMessages.length > 0) {
        setMessages(loadedMessages);
      }
    });
  }, []);
  
  // Handle sending messages
  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed && attachedImages.length === 0) return;
    
    const payload = {
      text: trimmed,
      images: attachedImages.map((img) => img.dataUrl),
      message_type: attachedImages.length > 0 ? 'media' : 'text',
      playback_time: typeof getCurrentTime === 'function'
        ? Math.floor(getCurrentTime() || 0)
        : undefined,
    };
    
    // Add user message to UI
    addMessage({ 
      role: 'user', 
      text: trimmed, 
      images: payload.images 
    });
    
    // Clear input
    clearInput();
    setIsLoading(true);
    
    // Connect and send
    if (!hasConnectedRef.current) {
      connect();
      hasConnectedRef.current = true;
      
      // Delay first message (as in original)
      setTimeout(() => {
        sendMessage(payload);
        analytics.doubtAsked();
      }, 3000);
    } else {
      sendMessage(payload);
      analytics.doubtAsked();
    }
  }, [input, attachedImages, getCurrentTime, connect, sendMessage, addMessage, clearInput, setIsLoading]);
  
  // Reset chat
  const resetChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('chatId');
    setIsLoading(false);
    hasConnectedRef.current = false;
    close();
    clearInput();
  }, [setMessages, setIsLoading, close, clearInput]);
  
  return {
    messages,
    input,
    setInput,
    attachedImages,
    isLoading,
    error,
    handleSend,
    handlePaste,
    removeImage,
    resetChat
  };
}
