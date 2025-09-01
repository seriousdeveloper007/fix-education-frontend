import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PlatformNavbar from '../../PlatformNavbar';
import ChatView from '../ChatView';
import QuestionView from '../QuestionView';
import TasksView from '../TasksView';
import { ChevronUp, ChevronDown, MessageSquare, PencilLine, Code } from 'lucide-react';

export function MobileLayout({ 
  videoId,
  startTime,
  iframeRef,
  getCurrentTime,
  unattemptedQuestionCount,
  updateQuestionCount
}) {
  const [isVideoCollapsed, setIsVideoCollapsed] = useState(false);
  const [activeFeature, setActiveFeature] = useState('Ask Doubt');

  // Auto-collapse video when keyboard opens
  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const screenHeight = window.screen.height;
      const keyboardOpen = viewportHeight < screenHeight * 0.75;
      
      if (keyboardOpen && !isVideoCollapsed) {
        setIsVideoCollapsed(true);
      }
    };

    const viewport = window.visualViewport || window;
    viewport.addEventListener('resize', handleResize);
    return () => viewport.removeEventListener('resize', handleResize);
  }, [isVideoCollapsed]);

  const featureButtons = [
    { id: 'Ask Doubt', label: 'Ask Doubt', icon: MessageSquare },
    { 
      id: 'Attempt Question', 
      label: 'Quiz', 
      icon: PencilLine,
      count: unattemptedQuestionCount > 0 ? unattemptedQuestionCount : null
    },
    { id: 'Code from Video', label: 'Code', icon: Code },
  ];

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'Ask Doubt':
        return <ChatView getCurrentTime={getCurrentTime} />;
      case 'Attempt Question':
        return <QuestionView updateQuestionCount={updateQuestionCount} />;
      case 'Code from Video':
        return <TasksView />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex-shrink-0">
        <PlatformNavbar defaultTab="Study Room" />
      </div>
      
      {/* Video Section */}
      <div className="flex-shrink-0">
        <div className={`relative bg-black transition-all duration-300 ${
          isVideoCollapsed ? 'h-0' : 'h-[50vh]'
        } overflow-hidden`}>
          {!isVideoCollapsed && (
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&start=${startTime}`}
              title="YouTube video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
        
        {/* Collapse Button */}
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-gray-600">
            Switch to desktop for best learning experience.
          </span>
          <button
            onClick={() => setIsVideoCollapsed(!isVideoCollapsed)}
            className="flex items-center gap-1 text-xs text-gray-700 hover:text-black transition-colors"
          >
            {isVideoCollapsed ? 'Show Video' : 'Hide Video'}
            {isVideoCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Feature Tabs */}
      <div className="flex-shrink-0 bg-gray-50 border-b border-gray-200">
        <div className="flex bg-gray-50 border-b border-gray-200">
          {featureButtons.map((feature) => {
            const Icon = feature.icon;
            const isActive = activeFeature === feature.id;
            
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors min-h-[60px] ${
                  isActive 
                    ? 'bg-white border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center relative">
                  <Icon className="w-5 h-5" />
                  {feature.count && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {feature.count}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">{feature.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Content */}
      <div className="flex-1 overflow-hidden bg-white">
        {renderFeatureContent()}
      </div>
    </>
  );
}

MobileLayout.propTypes = {
  videoId: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  iframeRef: PropTypes.object.isRequired,
  getCurrentTime: PropTypes.func.isRequired,
  unattemptedQuestionCount: PropTypes.number.isRequired,
  updateQuestionCount: PropTypes.func.isRequired
};