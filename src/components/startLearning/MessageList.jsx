import React, { useLayoutEffect, useRef } from "react";
import MarkdownRenderer from "../MarkdownRenderer";
import { LoadingDots } from "../startLearning/LoadingDots";
import RoadmapComponent from "./RoadmapRecommendation";

const FLOATING_FOOTER_PX = 130;

export const MessageList = React.memo(function MessageList({ messages, isLoading }) {
  const endRef = useRef(null);
  const bottomGap = FLOATING_FOOTER_PX;

  useLayoutEffect(() => {
    const target = endRef.current;
    if (!target) return;
    const id = requestAnimationFrame(() => {
      target.scrollIntoView({ block: "end", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [messages.length, isLoading, bottomGap]);

  return (
    <div 
      className="flex-1 min-h-0 overflow-y-auto space-y-3 mt-5" 
      style={{ paddingBottom: bottomGap }}
    >
      {messages.map((msg, idx) => {
        // Handle the raw message structure from API
        const isUser = msg.message_from === 'user';
        const isRoadmapRecommendation = msg.message_type === 'roadmap_recommended';
        const messageText = msg.text || '';

        const base = "px-3 py-2 rounded-xl text-sm break-words";
        const bubble = isUser 
          ? "ml-auto w-fit max-w-[75%] bg-blue-100" 
          : "mr-auto w-fit max-w-full bg-gray-100";

        // If it's a roadmap recommendation, render the roadmap component
        if (isRoadmapRecommendation) {
          return (
            <div key={idx} className="mr-auto w-full max-w-full">
              {/* Pass the complete message object as-is */}
              <RoadmapComponent message={msg} />
            </div>
          );
        }

        // Only render text messages that have content
        if (messageText) {
          return (
            <div key={idx} className={`${bubble} ${base}`}>
              <MarkdownRenderer text={messageText} />
            </div>
          );
        }

        // Don't render anything for empty messages
        return null;
      })}
      {isLoading && <LoadingDots />}
      <div ref={endRef} style={{ scrollMarginBottom: bottomGap }} />
    </div>
  );
});
