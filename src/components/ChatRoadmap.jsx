// import React, { useMemo, useCallback } from "react";
// import {
//   ROTATING_PROMPTS,
//   BG_ICONS,
//   useTypewriter
// } from "./chatroadmapcomponents"
// import { useRoadmapManager } from "./chatroadmapcomponents";
// import { BackgroundIconCloud } from "./chatroadmapcomponents";
// import { RoadmapDisplayView } from "./chatroadmapcomponents";
// import { RoadmapChatView } from "./chatroadmapcomponents";
// import { useWebSocketChat } from "./chatroadmapcomponents";
// import { MessageList } from "./chatroadmapcomponents";

// export default function ChatRoadmap() {

//   const {
//     existingRoadmap,
//     roadmapLoading,
//     chatDisabled,
//     updateTopicInRoadmap,
//     setRoadmapData,
//     resetRoadmapData,
//   } = useRoadmapManager();

//   const {
//     messages,
//     input,
//     setInput,
//     isLoading,
//     isFocused,
//     setIsFocused,
//     messageContainerRef,
//     handleSend,
//     resetChatState,
//     hasMessages,
//   } = useWebSocketChat({
//     onTopicUpdate: updateTopicInRoadmap,
//     onRoadmapCreate: setRoadmapData,
//   });

//   const typed = useTypewriter(ROTATING_PROMPTS, isFocused || input.length > 0);

//   const resetChat = useCallback(async () => {
//     await resetRoadmapData();
//     resetChatState();
//   }, [resetRoadmapData, resetChatState]);

//   const icons = useMemo(() => BG_ICONS, []);

//   return (
//     <>
//       <div className="relative w-full overflow-hidden min-h-screen text-slate-900 selection:bg-emerald-300/30 font-fraunces bg-white">

//         <BackgroundIconCloud icons={icons} />

//         {!roadmapLoading && existingRoadmap && (
//           <RoadmapDisplayView
//             existingRoadmap={existingRoadmap}
//             onReset={resetChat}
//           />
//         )}

//         {!roadmapLoading && !existingRoadmap && (
//           <RoadmapChatView
//             hasMessages={hasMessages}
//             chatDisabled={chatDisabled}
//             input={input}
//             setInput={setInput}
//             typed={typed}
//             handleSend={handleSend}
//             onReset={resetChat}
//             isLoading={isLoading}
//             setIsFocused={setIsFocused}
//             messages={messages}
//             messageContainerRef={messageContainerRef}
//             MessageList={MessageList}
//           />
//         )}

//       </div>
//     </>
//   );
// }


import React from "react";
import { BackgroundIconCloud } from "./chatroadmapcomponents";

export default function ChatRoadmap() {

  return (
    <div>
      <BackgroundIconCloud />
    </div>
  );
}
