import { BackgroundIconCloud } from "../components/BackgroundIconCloud";
import Navbar from "../components/Navbar";
import RoadmapHeading from "../components/chatroadmap/RoadmapHeading";
import TextAreaInput from "../components/chatroadmap/TextareaInput";
import { MessageList } from "../components/chatroadmap/MessageList";
import { useChatRoadMap } from "../hooks/ChatRoadMap";
import { ROTATING_PROMPTS } from "../components/chatroadmap/constants";
import RoadMapUI from "../components/chatroadmap/RoadMapUI";


export default function ChatRoadmap() {
  const {
    messages,
    input,
    setInput,
    handleSend,
    isLoading,
    resetChat,
    isLoadingHistory
  } = useChatRoadMap();


  return (
    <>
      <Navbar />
      <BackgroundIconCloud />
      <div className="relative z-10 flex-col font-fraunces px-[30px] lg:px-[250px]">
        {messages.length === 0 && <RoadmapHeading />}
        {messages.length > 0 && (
          <MessageList messages={messages} isLoading={isLoading} />
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
      </div>
    </>
  );
}
