import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowRight, X } from 'lucide-react'; // CHANGE: import X
import { useChatWebSocket } from './ChatWebSocket';
import analytics from '../services/posthogService';
import { API_BASE_URL } from '../config.js';
import MarkdownRenderer from './MarkdownRenderer';

export default function ChatView({ getCurrentTime }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // CHANGE: store images as an array (we’ll still restrict to 1 for now)
  const [attachedImages, setAttachedImages] = useState([]); 

  const hasConnectedRef = useRef(false);
  const bottomRef = useRef(null);
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

  // CHANGE: paste handler writes into array, enforces 1 image
  const handlePaste = async (e) => {
    const items = e.clipboardData?.items || [];
    const imgItem = Array.from(items).find((it) => it.type?.startsWith('image/'));
    if (!imgItem) return;

    if (attachedImages.length >= 1) { // enforce single image for now
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

  // CHANGE: remove by index (future-proof for multi-images)
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
    // unchanged stream handlers
    onMessage: (msg) => {
      // CHANGE: support messages arriving as { text, images: [...] }
      // If your server sends a string, parse here conditionally.
      let parsed = msg;
      try {
        parsed = typeof msg === 'string' ? JSON.parse(msg) : msg;
      } catch {
        // fallback: treat as plain text
        parsed = { text: String(msg), images: [] };
      }

      const role = parsed.role === 'assistant' ? 'agent' : parsed.role || 'agent';
      setMessages((prev) => [
        ...prev,
        { role, text: parsed.text ?? '', images: parsed.images ?? [] },
      ]);
    },
    onToken: (token) => {
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const chatId = localStorage.getItem('chatId');
    const token = localStorage.getItem('token');
    if (!chatId || !token) return;

    // CHANGE: fixed template string + map images
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
          // CHANGE: accept list from backend
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
  
    // CHANGE: Clear input and images immediately for instant UI feedback
    const messagesToAdd = { role: 'user', text: trimmed, images: payload.images };
    setInput('');
    
    // cleanup image object URLs and clear selection immediately
    attachedImages.forEach((img) => img?.url && URL.revokeObjectURL(img.url));
    setAttachedImages([]);
  
    const sendPayloadNow = () => {
      // optimistic append (message already prepared above)
      setMessages((prev) => [...prev, messagesToAdd]);
      sendMessage(payload);
      analytics.doubtAsked();
    };
  
    if (!hasConnectedRef.current) {
      // First time: connect, mark as connected, and delay the send by 3s
      connect();
      hasConnectedRef.current = true;
  
      setTimeout(() => {
        sendPayloadNow();
      }, 3000);
    } else {
      // Subsequent messages: send immediately
      sendPayloadNow();
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {error && (
        <div className="absolute left-0 right-0 top-0 z-20 px-4">
          <div className="mt-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        </div>
      )}

      {/* Scrollable message list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 mt-2 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${msg.role === 'user'
              ? 'ml-auto w-fit max-w-[75%] bg-blue-100'
              : 'mr-auto w-fit max-w-full bg-gray-100'
              } px-3 py-2 rounded-xl text-sm break-words`}
          >
            {/* CHANGE: render images[] */}
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
        <div ref={bottomRef} />
      </div>

      {/* Input area pinned at bottom */}
      <div className="mt-2 pt-1 pr-1 border rounded-xl flex items-start relative">
        {/* CHANGE: preview the (single) attached image */}
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
              // CHANGE: clear images on new chat
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
