import React from "react";
import MarkdownRenderer from "../MarkdownRenderer";
import { LoadingDots } from "./LoadingDots";



export const MessageList = React.memo(function MessageList({ messages, isLoading, containerRef }) {
    return (
      <div ref={containerRef} className="flex-1 overflow-y-auto space-y-3 mt-2 scrollbar-hide pb-4 pt-2">
        {messages.map((msg, idx) => {
          return (
            <div
              key={idx}
              className={`${msg.role === "user"
                  ? "ml-auto w-fit max-w-[75%] bg-blue-100"
                  : "mr-auto w-fit max-w-full bg-gray-100"
                } px-3 py-2 rounded-xl text-sm break-words`}
            >
              <MarkdownRenderer text={msg.text} />
            </div>
          );
        })}
        {isLoading && <LoadingDots />}
      </div>
    );
  });
  