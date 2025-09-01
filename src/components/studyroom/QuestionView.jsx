import { useEffect } from 'react';
import PropTypes from 'prop-types';
import themeConfig from '../themeConfig';
import { useQuestions } from '../../hooks/useQuestions';
import { MCQQuestion } from './MCQQuestion';
import { FillInTheBlank } from './FillInTheBlank';
import { SubjectiveQuestion } from './SubjectiveQuestion';
import { EmptyState } from './EmptyState';
import { QuestionSection } from './QuestionSection';

export default function QuestionView({ updateQuestionCount }) {
  const cfg = themeConfig.app;
  const { questions, loaded, submitAnswer } = useQuestions();

  useEffect(() => {
    // Load questions on mount is handled by the hook
  }, []);

  if (loaded && questions.length === 0) {
    return <EmptyState />;
  }

  const grouped = {
    mcq: questions.filter((q) => q.type === 'mcq'),
    fill: questions.filter((q) => q.type === 'fill_in_the_blanks'),
    subjective: questions.filter((q) => q.type === 'subjective'),
  };

  const handleSubmit = async (questionId, answer) => {
    const success = await submitAnswer(questionId, answer);
    if (success) {
      updateQuestionCount(-1);
    }
    return success;
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-8 overflow-y-auto">
      {grouped.mcq.length > 0 && (
        <QuestionSection title="MCQ" theme={cfg}>
          {grouped.mcq.map((q) => (
            <MCQQuestion 
              key={q.id} 
              question={q} 
              onSubmit={handleSubmit}
              theme={cfg} 
            />
          ))}
        </QuestionSection>
      )}

      {grouped.fill.length > 0 && (
        <QuestionSection title="Fill in the Blank" theme={cfg}>
          {grouped.fill.map((q) => (
            <FillInTheBlank 
              key={q.id} 
              question={q} 
              onSubmit={handleSubmit}
              theme={cfg} 
            />
          ))}
        </QuestionSection>
      )}

      {grouped.subjective.length > 0 && (
        <QuestionSection title="Subjective" theme={cfg}>
          {grouped.subjective.map((q) => (
            <SubjectiveQuestion 
              key={q.id} 
              question={q} 
              onSubmit={handleSubmit}
              theme={cfg} 
            />
          ))}
        </QuestionSection>
      )}
    </div>
  );
}

QuestionView.propTypes = {
  updateQuestionCount: PropTypes.func.isRequired,
};