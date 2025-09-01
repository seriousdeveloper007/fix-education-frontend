import { useState } from 'react';
import PropTypes from 'prop-types';
import MarkdownRenderer from '../MarkdownRenderer';
import { DifficultyBadge } from './DifficultyBadge';
import { AnswerFeedback } from './AnswerFeedback';

export function MCQQuestion({ question, onSubmit, theme }) {
  const { 
    question_text, 
    option_1, 
    option_2, 
    option_3, 
    difficulty_level, 
    correct_option_number 
  } = question.meta_data;
  
  const options = [option_1, option_2, option_3];
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (selected !== null && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const success = await onSubmit(question.id, {
          answer_option: options.indexOf(selected) + 1
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
      
      <ul className="space-y-2">
        {options.map((opt, idx) => (
          <li key={idx} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`${question.id}-${idx}`}
              name={`q-${question.id}`}
              onChange={() => setSelected(opt)}
              disabled={submitted}
              checked={selected === opt}
            />
            <label 
              htmlFor={`${question.id}-${idx}`} 
              className="text-sm"
            >
              {opt}
            </label>
          </li>
        ))}
      </ul>
      
      {!submitted && selected && (
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
        <AnswerFeedback 
          correctAnswer={options[correct_option_number - 1]}
        />
      )}
    </div>
  );
}

MCQQuestion.propTypes = {
  question: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};
