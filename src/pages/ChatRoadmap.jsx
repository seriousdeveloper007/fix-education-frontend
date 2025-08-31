import { BackgroundIconCloud } from "../components/BackgroundIconCloud";
import Navbar from "../components/Navbar";
import RoadmapHeading from "../components/chatroadmap/RoadmapHeading";
import TextAreaInput from "../components/chatroadmap/TextareaInput";
import { MessageList } from "../components/chatroadmap/MessageList";
import { useChatRoadMap } from "../hooks/ChatRoadMap";
import { ROTATING_PROMPTS } from "../components/chatroadmap/constants";
import RoadMapUI from "../components/chatroadmap/RoadMapUI";
import { useEffect } from 'react';



export default function ChatRoadmap() {
  const {
    messages,
    input,
    setInput,
    handleSend,
    handleCreateRoadmap,
    isLoading,
    resetChat,
    isLoadingHistory,
    nextWeekTopics,
    nextModules,
    roadmapTitle
  } = useChatRoadMap();

  useEffect(() => {
    if (nextWeekTopics) {
      // Scroll to top when roadmap is first shown
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [nextWeekTopics]);


  return (
    <>
      <Navbar />
      <BackgroundIconCloud />
      <div className="relative z-10 flex-col font-fraunces px-[30px] lg:px-[250px]">
        {messages.length === 0 && !nextWeekTopics && <RoadmapHeading />}
        {nextWeekTopics ? (
          <>
            <RoadMapUI title={roadmapTitle} topics={nextWeekTopics} nextModules={nextModules} />
            <div className="fixed inset-x-0 bottom-6 mx-[30px] lg:mx-[250px]">
              <button
                type="button"
                onClick={resetChat}
                className="w-full py-3 bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] hover:from-[#0369a1] hover:to-[#06b6d4] text-white font-semibold rounded-xl shadow-sm"
              >
                Create Roadmap Again
              </button>
            </div>
          </>
        ) : (
          <>
            {messages.length > 0 && (
              <MessageList
                messages={messages}
                isLoading={isLoading}
                onCreateRoadmap={handleCreateRoadmap}
              />
            )}
            <TextAreaInput
              prompts={ROTATING_PROMPTS}
              value={input}
              onChange={setInput}
              onSend={handleSend}
              onReset={resetChat}
              isDisable={isLoadingHistory || isLoading}
              floating={messages.length > 0}
            />
          </>
        )}
      </div>
    </>
  );
}
