import { useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import { BackgroundIconCloud } from '../components/BackgroundIconCloud';
import RoadmapHeading from '../components/chatroadmap/RoadmapHeading';
import TextAreaInput from '../components/chatroadmap/TextareaInput';
import { MessageList } from '../components/chatroadmap/MessageList';
import { ROTATING_PROMPTS } from '../components/chatroadmap/constants';

export default function StartLearningPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { role: 'user', kind: 'text', text }]);
    setInput('');
    setIsLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'agent', kind: 'text', text: 'Thanks for your message!' }]);
      setIsLoading(false);
    }, 1000);
  };

  const resetChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <>
      <Navbar />
      <BackgroundIconCloud />
      <div className="relative z-10 flex-col font-fraunces px-[30px] lg:px-[250px]">
        {messages.length === 0 && <RoadmapHeading />}
        {messages.length > 0 && (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
        <TextAreaInput
          prompts={ROTATING_PROMPTS}
          value={input}
          onChange={setInput}
          onSend={handleSend}
          onReset={resetChat}
          isDisable={isLoading}
          floating={messages.length > 0}
        />
      </div>
    </>
  );
}
