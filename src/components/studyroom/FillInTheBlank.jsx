import { useState } from 'react';
import PropTypes from 'prop-types';
import MarkdownRenderer from '../MarkdownRenderer';
import { DifficultyBadge } from './DifficultyBadge';
import { AnswerFeedback } from './AnswerFeedback';

export function FillInTheBlank({ question, onSubmit, theme }) {
  const { question_text, difficulty_level, correct_answer } = question.meta_data;
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!isSubmitting && answer.trim()) {
      setIsSubmitting(true);
      try {
        const success = await onSubmit(question.id, {
          answer_text: answer
        });
        if (success) {
          setSubmitted(true);
        }
      } catch (err) {
        console.error('Failed to submit answer:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="relative mt-4 p-4 pb-8 rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex justify-between items-start mb-1">
        <MarkdownRenderer 
          text={question_text} 
          className={`${theme.questionText} pr-4`} 
        />
        <DifficultyBadge level={difficulty_level} />
      </div>
      
      <input
        type="text"
        className={`${theme.inputfield} mb-4`}
        placeholder="Your answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={submitted}
      />
      
      {!submitted && answer.trim() && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitted || isSubmitting}
          className={theme.submitButton}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      )}

      {submitted && (
        <AnswerFeedback correctAnswer={correct_answer} />
      )}
    </div>
  );
}

FillInTheBlank.propTypes = {
  question: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};
