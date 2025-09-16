import { memo } from 'react';
import PropTypes from 'prop-types';

const LessonHeader = memo(({ lessonDisplayName, actionLabel, onActionClick }) => {
  return (
    <div className="shrink-0 flex items-center justify-between mb-4 min-w-0 gap-4">
      <div
        className="truncate text-xl flex-1 min-w-0"
        style={{ fontFamily: 'Francus' }}
      >
        {lessonDisplayName}
      </div>
      {actionLabel && (
        <button
          onClick={onActionClick}
          className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
});

LessonHeader.displayName = 'LessonHeader';

LessonHeader.propTypes = {
  lessonDisplayName: PropTypes.string.isRequired,
  actionLabel: PropTypes.string,
  onActionClick: PropTypes.func,
};

export default LessonHeader;

