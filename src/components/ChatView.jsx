import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowRight, X } from 'lucide-react';
import { useChatWebSocket } from './ChatWebSocket';
import analytics from '../services/posthogService';
import { API_BASE_URL } from '../config.js';
import MarkdownRenderer from './MarkdownRenderer';


const LoadingDots = () => (
  <div className="mr-auto w-fit max-w-full bg-gray-100 px-3 py-2 rounded-xl text-sm">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  </div>
);

export default function ChatView({ getCurrentTime }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [attachedImages, setAttachedImages] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);

  const hasConnectedRef = useRef(false);
  const bottomRef = useRef(null);
  const messageContainerRef = useRef(null); // Add ref for the message container
  const [error, setError] = useState('');
  const errorTimerRef = useRef(null);

  const showError = (msg) => {
    clearTimeout(errorTimerRef.current);
    setError(msg);
    errorTimerRef.current = setTimeout(() => setError(''), 2200);
  };

  const dataUrlFromFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePaste = async (e) => {
    const items = e.clipboardData?.items || [];
    const imgItem = Array.from(items).find((it) => it.type?.startsWith('image/'));
    if (!imgItem) return;

    if (attachedImages.length >= 1) {
      showError('Only one image is allowed. Remove the current one to paste another.');
      e.preventDefault();
      return;
    }

    const file = imgItem.getAsFile();
    if (!file) return;

    e.preventDefault();
    try {
      const dataUrl = await dataUrlFromFile(file);
      const objectUrl = URL.createObjectURL(file);
      setAttachedImages((prev) => [
        ...prev,
        {
          file,
          url: objectUrl,
          dataUrl,
          mime: file.type,
          name: file.name || 'pasted-image.png',
        },
      ]);
    } catch {
      showError('Could not read the pasted image.');
    }
  };

  const removeImageAt = (idx) => {
    setAttachedImages((prev) => {
      const next = [...prev];
      const [removed] = next.splice(idx, 1);
      if (removed?.url) URL.revokeObjectURL(removed.url);
      return next;
    });
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      attachedImages.forEach((img) => img?.url && URL.revokeObjectURL(img.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { sendMessage, connect, close } = useChatWebSocket({
    onMessage: (msg) => {
      setIsLoading(false);

      let parsed = msg;
      try {
        parsed = typeof msg === 'string' ? JSON.parse(msg) : msg;
      } catch {
        parsed = { text: String(msg), images: [] };
      }

      const role = parsed.role === 'assistant' ? 'agent' : parsed.role || 'agent';
      setMessages((prev) => [
        ...prev,
        { role, text: parsed.text ?? '', images: parsed.images ?? [] },
      ]);
    },
    onToken: (token) => {
      setIsLoading(false)
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (!last || last.role === 'user') {
          return [...prev, { role: 'agent', text: token, images: [] }];
        }
        const updated = [...prev];
        updated[prev.length - 1] = { ...last, text: (last.text || '') + token };
        return updated;
      });
    },
    getPlaybackTime: getCurrentTime,
  });

  // FIX: Use container scrolling instead of scrollIntoView
  useEffect(() => {
    if (messageContainerRef.current) {
      // Directly set scrollTop to scroll to bottom within the container
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]); // Also trigger on isLoading to scroll when dots appear

  useEffect(() => {
    const chatId = localStorage.getItem('chatId');
    const token = localStorage.getItem('token');
    if (!chatId || !token) return;

    fetch(`${API_BASE_URL}/messages/${chatId}`, {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const loaded = (data.messages || []).map((m) => ({
          role: m.message_from === 'assistant' ? 'agent' : 'user',
          text: m.text,
          images: Array.isArray(m.images) ? m.images : [], 
        }));
        setMessages(loaded);
      })
      .catch((err) => {
        console.error('Failed to load messages', err);
      });
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
  
    const payload = {
      text: trimmed,
      images: attachedImages.map((img) => img.dataUrl),
      message_type: attachedImages.length > 0 ? 'media' : 'text',
      playback_time:
        typeof getCurrentTime === 'function'
          ? Math.floor(getCurrentTime() || 0)
          : undefined,
    };
  
    const messagesToAdd = { role: 'user', text: trimmed, images: payload.images };
    setInput('');
    
    attachedImages.forEach((img) => img?.url && URL.revokeObjectURL(img.url));
    setAttachedImages([]);
  
    setMessages((prev) => [...prev, messagesToAdd]);
    setIsLoading(true);
  
    if (!hasConnectedRef.current) {
      connect();
      hasConnectedRef.current = true;
      
      setTimeout(() => {
        sendMessage(payload);
        analytics.doubtAsked();
      }, 3000);
    } else {
      sendMessage(payload);
      analytics.doubtAsked();
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {error && (
        <div className="absolute left-0 right-0 top-0 z-20 px-4">
          <div className="mt-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        </div>
      )}

      {/* Scrollable message list with ref */}
      <div 
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-1 mt-2 scrollbar-hide"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${msg.role === 'user'
              ? 'ml-auto w-fit max-w-[75%] bg-blue-100'
              : 'mr-auto w-fit max-w-full bg-gray-100'
              } px-3 py-2 rounded-xl text-sm break-words`}
          >
            {Array.isArray(msg.images) && msg.images.length > 0 && (
              <div className="mb-2 space-y-2">
                {msg.images.map((img, i) => (
                  <img
                    key={i}
                    src={typeof img === 'string' ? img : (img.dataUrl || img.url)}
                    alt={typeof img === 'string' ? 'image' : (img.name || 'attachment')}
                    className="rounded-xl max-w-full h-auto"
                  />
                ))}
              </div>
            )}
            <MarkdownRenderer text={msg.text} />
          </div>
        ))}
        {isLoading && <LoadingDots />}
        <div ref={bottomRef} />
      </div>

      {/* Input area pinned at bottom */}
      <div className="mt-2 pt-1 pr-1 border rounded-xl flex items-start relative">
        {attachedImages.length > 0 && (
          <div className="absolute left-3 bottom-full mb-2 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="relative w-28 h-20">
              <img
                src={attachedImages[0].url}
                alt="pasted"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImageAt(0)}
                className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-black/80 text-white flex items-center justify-center shadow-md"
                title="Remove"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
        <textarea
          rows={5}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Paste screenshot or type your doubt.."
          className="flex-1 resize-none px-3 py-1 text-sm focus:outline-none focus:ring-0 border-none scrollbar-hide"
          style={{
            maxHeight: '120px',
            minHeight: '40px',
            overflowY: 'auto',
          }}
        />
        <div className="ml-2 flex flex-col items-center space-y-2">
          <button
            onClick={handleSend}
            className="p-2 rounded-full bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] hover:from-[#0369a1] hover:to-[#06b6d4] text-white h-[40px] w-[40px] flex items-center justify-center transition-all"
          >
            <ArrowRight size={20} />
          </button>
          <span
            onClick={() => {
              setMessages([]);
              localStorage.removeItem('chatId');
              hasConnectedRef.current = false;
              close();
              attachedImages.forEach((img) => img?.url && URL.revokeObjectURL(img.url));
              setAttachedImages([]);
            }}
            className="text-xs font-medium bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] bg-clip-text text-transparent hover:underline cursor-pointer"
          >
            + New
          </span>
        </div>
      </div>
    </div>
  );
}

ChatView.propTypes = {
  getCurrentTime: PropTypes.func,
};