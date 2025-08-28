import { BackgroundIconCloud } from "../components/BackgroundIconCloud";
import Navbar from "../components/Navbar";
import RoadmapHeading from "../components/chatroadmap/RoadmapHeading";
import TextAreaInput from "../components/chatroadmap/TextareaInput";
import { MessageList, ROTATING_PROMPTS } from "../components/chatroadmap";
import { useChatRoadMap } from "../hooks/ChatRoadMap";

export default function ChatRoadmap() {
  const {
    messages,
    input,
    setInput,
    handleSend,
    isLoading,
    hasStarted,
    messageContainerRef,
  } = useChatRoadMap();

  return (
    <>
      <Navbar />
      <BackgroundIconCloud />
      <div className="flex-col font-fraunces px-[30px] lg:px-[250px]">
        {!hasStarted && <RoadmapHeading />}
        {hasStarted && (
          <MessageList
            messages={messages}
            isLoading={isLoading}
            containerRef={messageContainerRef}
          />
        )}
        <TextAreaInput
          prompts={ROTATING_PROMPTS}
          value={input}
          onChange={setInput}
          onSend={handleSend}
        />
      </div>
    </>
  );
}
