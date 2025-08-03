import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import themeConfig from './themeConfig';

export default function ChatView() {
  const cfg = themeConfig.app;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessages = [
      ...messages,
      { role: 'user', text: trimmed },
      { role: 'agent', text: 'We are processing your response' },
    ];
    setMessages(newMessages);
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
                ? 'ml-auto w-fit max-w-[75%] bg-blue-100 text-right'
                : 'mr-auto w-fit max-w-full bg-gray-100 text-left'
            } px-3 py-2 rounded-xl text-sm whitespace-pre-line`}
          >
            {msg.text}
          </div>
          
        ))}
      </div>

      {/* Input area pinned at bottom */}
      <div className="mt-2 pt-1 pr-1 border rounded-xl flex items-start">
        <textarea
          rows={5}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your doubt..."
          className="flex-1 resize-none px-3 py-1 text-sm focus:outline-none focus:ring-0 border-none scrollbar-hide"
          style={{
            maxHeight: '120px',
            minHeight: '40px',
            overflowY: 'auto',
          }}
        />
        <button
          onClick={handleSend}
          className="ml-2 p-2 rounded-full bg-black text-white hover:bg-gray-800 h-[40px]"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
