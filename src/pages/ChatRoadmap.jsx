import { BackgroundIconCloud } from "../components/BackgroundIconCloud";
import Navbar from "../components/Navbar";
import RoadmapHeading from "../components/chatroadmap/RoadmapHeading";
import TextAreaInput from "../components/chatroadmap/TextareaInput";
import { MessageList } from "../components/chatroadmap/MessageList";
import { useChatRoadMap } from "../hooks/ChatRoadMap";
import { ROTATING_PROMPTS, FOLLOW_UP_PROMPTS } from "../components/chatroadmap/constants";
import RoadMapUI from "../components/chatroadmap/RoadMapUI";
import { useEffect } from 'react';
import analytics from "../services/posthogService";




export default function ChatRoadmap() {
  const {
    messages,
    input,
    setInput,
    handleSend,
    handleCreateRoadmap,
    handleFollowUp,
    isLoading,
    resetChat,
    isLoadingHistory,
    isUpdatingTopics,
    nextWeekTopics,
    nextModules,
    roadmapTitle,
    sessionStartTime
  } = useChatRoadMap();

  useEffect(() => {
    if (nextWeekTopics) {
      // Scroll to top when roadmap is first shown
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [nextWeekTopics]);


  // Track page load and session start
  useEffect(() => {
    analytics.roadmapChatPageLoaded();
    
    // Track if user starts chatting (first message)
    if (messages.length === 1 && messages[0].role === 'user') {
      analytics.roadmapChatStarted();
    }
  }, []);

  // Track when roadmap is first shown
  useEffect(() => {
    if (nextWeekTopics) {
      // Scroll to top when roadmap is first shown
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Track roadmap creation completion
      analytics.roadmapCreationCompleted(messages.length, Date.now() - sessionStartTime);
    }
  }, [nextWeekTopics]);

  // Track page abandonment
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (messages.length > 0 && !nextWeekTopics) {
        const stage = messages.some(m => m.kind === 'roadmap') ? 'analysis' : 'chat';
        analytics.roadmapAbandoned(stage, messages.length, Date.now() - sessionStartTime);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [messages.length, nextWeekTopics]);



  return (
    <>
      <Navbar />
      <BackgroundIconCloud />
      <div className="relative z-10 flex-col font-fraunces px-[30px] lg:px-[250px]">
        {messages.length === 0 && !nextWeekTopics && <RoadmapHeading />}
        {nextWeekTopics ? (
          <>
            <RoadMapUI
              title={roadmapTitle}
              topics={nextWeekTopics}
              nextModules={nextModules}
              isLoadingTopics={isUpdatingTopics}
            />
            <TextAreaInput
              prompts={FOLLOW_UP_PROMPTS}
              value={input}
              onChange={setInput}
              onSend={handleFollowUp}
              onReset={resetChat}
              isDisable={isLoadingHistory || isLoading || isUpdatingTopics}
              floating={true}
            />
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
