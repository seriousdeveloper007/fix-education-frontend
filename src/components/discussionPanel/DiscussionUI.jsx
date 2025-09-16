import React from 'react';
import { MessageList } from '../startLearning/MessageList';

const DiscussionUI = ({ lessonId, lessonName }) => {
  const defaultMessages = [
    {
      message_from: 'agent',
      text: 'Creating a question for you',
    },
  ];

  return (
    <div>
      <MessageList messages={defaultMessages} isLoading={false} />
    </div>
  );
};

export default DiscussionUI;