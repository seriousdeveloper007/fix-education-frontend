import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowRight } from 'lucide-react';
import { useChatWebSocket } from './ChatWebSocket';
import analytics from '../services/posthogService';
import { API_BASE_URL } from '../config.js';
import MarkdownRenderer from './MarkdownRenderer';



export default function ChatView({ getCurrentTime }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const hasConnectedRef = useRef(false);
  const bottomRef = useRef(null);


  
  const { sendMessage, connect, close } = useChatWebSocket({
    onMessage: (msg) => {
      setMessages((prev) => [...prev, { role: 'agent', text: msg }]);
    },
    onToken: (token) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (!last || last.role === 'user') {
          return [...prev, { role: 'agent', text: token }];
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

    if (!hasConnectedRef.current) {
      connect();
      hasConnectedRef.current = true;
    
      // Delay message send until after 3 seconds
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
        sendMessage(trimmed);
      }, 3000);
      } else {
        // For subsequent messages, no delay needed
        setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
        sendMessage(trimmed);
      }
      analytics.doubtAsked();

      setInput('');
    };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // prevent newline
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable message list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 mt-2 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div
          key={idx}
          className={`${
            msg.role === 'user'
              ? 'ml-auto w-fit max-w-[75%] bg-blue-100'
              : 'mr-auto w-fit max-w-full bg-gray-100'
          } px-3 py-2 rounded-xl text-sm break-words`}
        >
          <MarkdownRenderer text={msg.text} />
        </div>
        
        
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area pinned at bottom */}
      <div className="mt-2 pt-1 pr-1 border rounded-xl flex items-start">
        <textarea
          rows={5}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
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
