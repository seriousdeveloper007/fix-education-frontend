import { useState, useRef } from 'react';
import { BackgroundIconCloud, MessageList } from '../components/chatroadmapcomponents';
import { useChatRoadmap } from '../hooks/ChatRoadMap';

const RoadmapHeading = () => (
  <h1 className="text-2xl font-bold mb-4">Roadmap Chat</h1>
);

export default function ChatRoadmap() {
  const [input, setInput] = useState('');
  const { messages, sendUserMessage } = useChatRoadmap();
  const containerRef = useRef(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendUserMessage(trimmed);
    setInput('');
  };

  return (
    <div className="p-4">
      <BackgroundIconCloud />
      {messages.length === 0 ? (
        <RoadmapHeading />
      ) : (
        <MessageList
          messages={messages}
          isLoading={false}
          containerRef={containerRef}
        />
      )}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 flex-1"
          placeholder="Type a message"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
