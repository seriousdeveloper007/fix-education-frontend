import themeConfig from './themeConfig';
import { X } from 'lucide-react';
import ChatView from './ChatView';
import PropTypes from 'prop-types';
import QuestionView from './QuestionView';

export default function SidePanel({ tab, onClose, getCurrentTime, updateQuestionCount }) {
  const cfg = themeConfig.app;

  const renderContent = () => {
    if (tab === 'Ask Doubt') {
      return <p className={cfg.cardSubheading}>Ask your doubt here</p>;
    }
    if (tab === 'Attempt Question') {
      return <p className={cfg.cardSubheading}>Here&apos;s a question to try</p>;
    }
    if (tab === 'Take Notes') {
      return <p className={cfg.cardSubheading}>Take your notes here</p>;
    }
    return null;
  };

  const renderUI = () => {
    if (tab === 'Ask Doubt') return <ChatView getCurrentTime={getCurrentTime} />;
    if (tab === 'Attempt Question') {
      return <QuestionView updateQuestionCount={updateQuestionCount} />
    }
    return null;
  };

  return (
    <div className={`w-1/3 bg-white shadow rounded-none flex flex-col h-full px-2 py-2`}>
      <div className="flex items-center justify-between px-1 py-0.5 border-b">
        <div className="px-1">{renderContent()}</div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 px-1">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">{renderUI()}</div>
    </div>
  );
}

SidePanel.propTypes = {
  tab: PropTypes.string,
  onClose: PropTypes.func,
  getCurrentTime: PropTypes.func,
};
