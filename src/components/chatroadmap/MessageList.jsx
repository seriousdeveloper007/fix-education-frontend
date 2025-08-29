import React, { useLayoutEffect, useRef } from "react";
import MarkdownRenderer from "../MarkdownRenderer";
import { LoadingDots } from "./LoadingDots";
import RoadmapAnalysis from "./RoadmapAnalysis";

const FLOATING_FOOTER_PX = 130; // ≈ textarea + breathing room

export const MessageList = React.memo(function MessageList({
  messages,
  isLoading,
}) {
  const endRef = useRef(null);
  const bottomGap = FLOATING_FOOTER_PX

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
      style={{
        // real space so content never hides under the fixed input
        paddingBottom: bottomGap,
      }}
    >
      {messages.map((msg, idx) => {
        const isUser = msg.role === "user";
        const isRoadmap = msg.kind === "roadmap";

        const base = "px-3 py-2 rounded-xl text-sm break-words";
        const bubble = isUser
          ? "ml-auto w-fit max-w-[75%] bg-blue-100"
          : "mr-auto w-fit max-w-full bg-gray-100";
          return (
            <div key={idx} className={`${bubble} ${base}`}>
              {isRoadmap ? (
                <RoadmapAnalysis roadmap={msg.payload} />
              ) : (
                <MarkdownRenderer text={msg.text} />
              )}
            </div>
          );  
      })}
      {isLoading && <LoadingDots/>}
      <div ref={endRef} style={{ scrollMarginBottom: bottomGap }} />
    </div>
  );
});
