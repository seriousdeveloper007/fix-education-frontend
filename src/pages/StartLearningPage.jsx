import { useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import { BackgroundIconCloud } from '../components/BackgroundIconCloud';
import RoadmapHeading from '../components/startLearning/RoadmapHeading';
import TextAreaInput from '../components/startLearning/TextareaInput';
import { MessageList } from '../components/startLearning/MessageList';
import { ROTATING_PROMPTS } from '../components/startLearning/constants';
import { useStartLearning } from '../hooks/useStartLearning';
import { useRoadmap } from '../hooks/useRoadmap';
import RoadmapView from '../components/startLearning/RoadmapRecommendation';

export default function StartLearningPage() {
  const [input, setInput] = useState('');
  const { messages, isAwaitingResponse, startLearning, reset } = useStartLearning();
  const { 
    hasRoadmap, 
    roadmapData, 
    activeLessons, 
    futureLessons, 
    isLoading: roadmapLoading 
  } = useRoadmap();

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

  if (roadmapLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </>
    );
  }

return (
  <>
    <Navbar />
    <BackgroundIconCloud />
    <div className="relative z-10 flex-col font-fraunces px-[30px] lg:px-[250px]">
      {hasRoadmap ? (
        <>
          <div className="py-8">
            <h1 className="text-center text-2xl sm:text-3xl font-bold text-slate-900">
              Your Learning Roadmap
            </h1>
          </div>
          <RoadmapView 
            data={{
              module_name: roadmapData?.payload?.module_name,
              why_this_roadmap: roadmapData?.payload?.why_this_roadmap,
              activeLessons,
              futureLessons
            }}
            messageId={messages}
            isFromDatabase={true}
          />
        </>
      ) : (
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
);}