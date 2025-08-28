import React, { useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import CreateNewButton from './CreateNewButton';
import { useAutoScroll } from './hooks';

const TextAreaInput = ({
  value,
  onChange,
  onSend,
  onReset,
  onFocus,
  onBlur,
  placeholder = "",
  disabled = false,
  rows = 4,
  showTypedText, // For the typewriter effect in Hero
  className = "",
}) => {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    },
    [onSend]
  );

  return (
    <div className={`border rounded-xl flex items-start px-2 py-1 shadow-sm bg-white/70 backdrop-blur-md ${className}`}>
      <div className="relative flex-1">
        {/* Typewriter effect - only show in Hero */}
        {value.length === 0 && showTypedText && (
          <div className="pointer-events-none absolute left-3 top-2.5 right-2 text-sm text-slate-400/90">
            {showTypedText}
            <span className="inline-block w-2 animate-pulse">|</span>
          </div>
        )}
        
        <textarea
          rows={rows}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full resize-none px-3 py-2 text-sm focus:outline-none focus:ring-0 border-none scrollbar-hide bg-transparent"
          style={{ maxHeight: "120px", minHeight: "40px", overflowY: "auto" }}
        />
      </div>

      <div className="ml-2 flex flex-col items-center space-y-2">
        <button
          onClick={onSend}
          className="p-2 rounded-full bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] hover:from-[#0369a1] hover:to-[#06b6d4] text-white h-[40px] w-[40px] flex items-center justify-center transition-all"
          title="Send"
        >
          <ArrowRight size={20} />
        </button>
        {onReset && (
          <span
            onClick={onReset}
            className="text-xs font-medium bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] bg-clip-text text-transparent hover:underline cursor-pointer"
          >
            + Start Again
          </span>
        )}
      </div>
    </div>
  );
};

// Hero component definition (moved here to keep it with its usage)
const Hero = React.memo(function Hero({ input, setInput, typed, onSend, onReset, onFocus, onBlur, isLoading }) {
  return (
    <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-start">
      <div className="w-full">
        {/* <RoadmapNavbar /> */}
      </div>

      <div className="max-w-4xl px-1 text-center pt-12">
        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mx-2">
          Achieve your goal by building your{" "}
          <span className="relative inline-block px-1 py-1 sm:py-2">
            <span className="absolute inset-x-0 bottom-0 h-3 bg-emerald-200/60 rounded-lg -z-10" />
            <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
              Personalized Roadmap
            </span>
          </span>
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-700 max-w-4xl mx-auto">
          "ILON AI curates the best free resources from YouTube, GitHub, LeetCode, HackerRank, and more — matched to your skill level."
        </p>
      </div>

      <div className="mt-12 w-full max-w-4xl px-1">
        <TextAreaInput
          value={input}
          onChange={setInput}
          onSend={onSend}
          onReset={onReset}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={isLoading}
          showTypedText={typed}
          rows={4}
        />
      </div>
    </div>
  );
});

// Composer component definition (moved here to keep it with its usage)
const Composer = React.memo(function Composer({
  value,
  onChange,
  onSend,
  onReset,
  onFocus,
  onBlur,
  isLoading,
  placeholder = "Type your goal or current skills…",
  rows = 4,
  messages = [],
  containerRef,
  MessageList,
}) {

  useAutoScroll(containerRef, [messages, isLoading]);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <div className="w-full flex-shrink-0">
        {/* <RoadmapNavbar /> */}
      </div>

      {/* Message List Container */}
      <div className="flex-1 overflow-hidden flex justify-center">
        <div className="w-full max-w-4xl px-1 py-2 flex flex-col h-full">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            containerRef={containerRef}
          />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 flex justify-center mb-4">
        <div className="w-full max-w-4xl px-1">
          <TextAreaInput
            value={value}
            onChange={onChange}
            onSend={onSend}
            onReset={onReset}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={isLoading}
            placeholder={placeholder}
            rows={rows}
            className="bg-white/80"
          />
        </div>
      </div>
    </div>
  );
});

export default function RoadmapChatView({
  hasMessages,
  chatDisabled,
  input,
  setInput,
  typed,
  handleSend,
  onReset,
  isLoading,
  setIsFocused,
  messages,
  messageContainerRef,
  MessageList,
}) {
  // Early return for initial hero state
  if (!hasMessages) {
    return (
      <Hero
        input={input}
        setInput={setInput}
        typed={typed}
        onSend={handleSend}
        onReset={onReset}
        isLoading={isLoading}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    );
  }

  // Chat disabled state - show empty state with reset option
  if (chatDisabled) {
    return (
      <div className="relative z-10 h-screen w-full flex flex-col">
        <div className="w-full">
          <RoadmapNavbar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <CreateNewButton onClick={onReset} />
        </div>
      </div>
    );
  }

  // Active chat state - show composer
  return (
    <Composer
      value={input}
      onChange={setInput}
      onSend={handleSend}
      onReset={onReset}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      isLoading={isLoading}
      messages={messages}
      containerRef={messageContainerRef}
      placeholder="Type your goal or current skills…"
      rows={4}
      MessageList={MessageList}
    />
  );
}