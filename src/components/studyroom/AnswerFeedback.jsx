import PropTypes from 'prop-types';
import MarkdownRenderer from '../MarkdownRenderer';

export function AnswerFeedback({ correctAnswer, isMarkdown = false }) {
  return (
    <div className="mt-4 space-y-1 text-sm">
      <div className="text-yellow-800 bg-yellow-50 border border-yellow-200 rounded p-2">
        {isMarkdown ? (
          <>
            <span className="font-semibold">Correct Answer is:</span>
            <div className="mt-1">
              <MarkdownRenderer text={correctAnswer} />
            </div>
          </>
        ) : (
          <>
            Correct answer is: <span className="font-semibold">{correctAnswer}</span>
          </>
        )}
      </div>
    </div>
  );
}

AnswerFeedback.propTypes = {
  correctAnswer: PropTypes.string.isRequired,
  isMarkdown: PropTypes.bool,
};