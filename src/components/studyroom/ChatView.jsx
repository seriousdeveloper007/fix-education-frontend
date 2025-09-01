import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { MessageList } from '../chatroadmap/MessageList';
import { ChatInput } from './ChatInput';
import { ErrorBanner } from './ErrorBanner';
import { useChat } from '../../hooks/chat/useChat';

export default function ChatView({ getCurrentTime }) {
  const messageContainerRef = useRef(null);
  
  const {
    messages,
    input,
    attachedImages,
    isLoading,
    error,
    handleSend,
    setInput,
    handlePaste,
    removeImage,
    resetChat
  } = useChat({ getCurrentTime });
  
  // Auto-scroll effect
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = 
        messageContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  
  return (
    <div className="flex flex-col h-full relative px-2">
      {error && <ErrorBanner error={error} />}
      
      <div 
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-1 mt-2 scrollbar-hide"
      >
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
        />
      </div>
      
      <ChatInput
        input={input}
        attachedImages={attachedImages}
        onInputChange={setInput}
        onSend={handleSend}
        onPaste={handlePaste}
        onRemoveImage={removeImage}
        onReset={resetChat}
        isDisabled={false}
      />
    </div>
  );
}

ChatView.propTypes = {
  getCurrentTime: PropTypes.func,
};
