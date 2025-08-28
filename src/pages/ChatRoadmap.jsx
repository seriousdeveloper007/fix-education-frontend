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
  } = useChatRoadMap();

  return (
    <>
      <Navbar />
      <BackgroundIconCloud />
      <div className="flex-col font-fraunces px-[30px] lg:px-[250px]">
        {messages.length === 0 && <RoadmapHeading />}
        {messages.length > 0 && (
          <MessageList
            messages={messages}
            isLoading={isLoading}
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
