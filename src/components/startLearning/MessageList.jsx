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
        const isUser = msg.role === "user";
        const isFirstRecommendation = msg.type === 'roadmap_recommendation';

        const base = "px-3 py-2 rounded-xl text-sm break-words";
        const bubble = isUser
          ? "ml-auto w-fit max-w-[75%] bg-blue-100"
          : "mr-auto w-fit max-w-full bg-gray-100";

        if (isFirstRecommendation) {
          return (
            <div key={idx} className="mr-auto w-full max-w-full">
              <RoadmapComponent data={msg.payload} messageId={msg.messageId}  />
            </div>
          );
        }

        return (
          <div key={idx} className={`${bubble} ${base}`}>
            <MarkdownRenderer text={msg.text} />
          </div>
        );
      })}
      {isLoading && <LoadingDots />}
      <div ref={endRef} style={{ scrollMarginBottom: bottomGap }} />
    </div>
  );
});


// user clicks on the minilesson - you fetch the message id , payload , minilesson name , userid and call the create roadmap api 
//create roadmap api will create all the ids and return you the minilesson_id - redirect to short_lesson/mini_id
//on learn-now - show the roadmap and not chat 
//whenever user lands on the learn-now - if call find-roadmap with the roamdap_id , user_id , chat_id . if yes show else show chat_id 




// AI Payload - dict1
// API PAYLOAD - dict2 