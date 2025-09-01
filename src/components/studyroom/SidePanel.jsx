import themeConfig from '../themeConfig';
import { X } from 'lucide-react';
import ChatView from './ChatView';
import PropTypes from 'prop-types';
import QuestionView from './QuestionView';
import NoteView from './NoteView';
import TasksView from './TasksView';

export default function SidePanel({ tab, onClose, getCurrentTime, updateQuestionCount }) {
  const cfg = themeConfig.app;

  const getTitle = () => {
    if (tab === 'Ask Doubt') return 'Ask your doubt';
    if (tab === 'Attempt Question') return 'Practice Questions';
    if (tab === 'Code from Video') return 'Extracted Code from Video';
    // if (tab === 'Take Notes') return 'Take Notes';
    return '';
  };

  const renderUI = () => {
    if (tab === 'Ask Doubt') return <ChatView getCurrentTime={getCurrentTime} />;
    if (tab === 'Attempt Question') return <QuestionView updateQuestionCount={updateQuestionCount} />;
    if (tab === 'Code from Video') {
      return <TasksView />;
    }
    // if (tab === 'Take Notes') {
    //   const tabId = localStorage.getItem('tabId');
    //   return <NoteView tabId={tabId} />;
    // }
    return null;
  };

  return (
    <div className="w-1/3 bg-white shadow-lg rounded-none flex flex-col h-full">
      {/* Header with title and close button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">{getTitle()}</h2>
        <button 
          onClick={onClose} 
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          aria-label="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {renderUI()}
      </div>
    </div>
  );
}

SidePanel.propTypes = {
  tab: PropTypes.string,
  onClose: PropTypes.func,
  getCurrentTime: PropTypes.func,
  updateQuestionCount: PropTypes.func,
};