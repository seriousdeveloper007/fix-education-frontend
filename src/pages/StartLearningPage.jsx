import { useState  ,useEffect} from 'react';
import Navbar from '../components/navbar/Navbar';
import { BackgroundIconCloud } from '../components/BackgroundIconCloud';
import RoadmapHeading from '../components/startLearning/RoadmapHeading';
import TextAreaInput from '../components/startLearning/TextareaInput';
import { MessageList } from '../components/startLearning/MessageList';
import { ROTATING_PROMPTS } from '../components/startLearning/constants';
import { useStartLearning } from '../hooks/useStartLearning';
import RoadmapComponent from '../components/startLearning/RoadmapRecommendation';

export default function StartLearningPage() {
  const [input, setInput] = useState('');

  const { messages, isAwaitingResponse, startLearning, reset , roadmapStatus  , RoadmapStatusCheck , roadmapData} = useStartLearning();
  
  useEffect( () => {
    RoadmapStatusCheck();  
  }, []);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    startLearning(text);
    setInput('');
  };

  const handleReset = () => {
    reset();
    setInput('');
  };

  return (
    <>
      <Navbar />
      <BackgroundIconCloud />
      <div className="relative z-10 flex-col font-fraunces px-[30px] lg:px-[250px]">
        
        {/* Loading state */}
        {roadmapStatus === "checking" && (
          <div>Loading...</div>
        )}
  
        {/* Roadmap present */}
        {roadmapStatus === "present" && (
          <div className="my-10">
            <RoadmapComponent message={roadmapData} />  
          </div>
        )}
  
        {/* No roadmap */}
        {roadmapStatus === "none" && (
          <>
            {messages.length === 0 && <RoadmapHeading />}
            {messages.length > 0 && (
              <MessageList messages={messages} isLoading={isAwaitingResponse} />
            )}
            <TextAreaInput
              prompts={ROTATING_PROMPTS}
              value={input}
              onChange={setInput}
              onSend={handleSend}
              onReset={handleReset}
              isDisable={isAwaitingResponse}
              floating={messages.length > 0}
            />
          </>
        )}
      </div>
    </>
  );
}