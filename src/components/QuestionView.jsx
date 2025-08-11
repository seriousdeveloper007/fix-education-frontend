import React, { useEffect, useState } from 'react';
import themeConfig from './themeConfig';
import { fetchUnattemptedQuestions, submitQuestionAnswer } from '../services/questionService';
import MarkdownRenderer from './MarkdownRenderer';



const getDifficultyColor = (level) => {
  if (level === 'easy') return 'bg-green-100 text-green-700';
  if (level === 'medium') return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

function MCQQuestion({ question, updateQuestionCount, theme }) {
  const { question_text, option_1, option_2, option_3, difficulty_level, correct_option_number } = question.meta_data;
  const options = [option_1, option_2, option_3];
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (selected !== null) {
      try {
        await submitQuestionAnswer({
          question_id: question.id,
          answer_option: options.indexOf(selected) + 1,
        });
        updateQuestionCount(-1);
        setSubmitted(true);
      } catch (err) {
        console.error('Failed to submit answer:', err.message);
      }
    }
  };

  return (
    <div className="relative mt-4 p-4 pb-8 rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex justify-between items-start mb-1">
        <MarkdownRenderer text={question_text} className={`${theme.questionText} pr-4`} />
        <div className={`shrink-0 px-2 py-0.5 text-xs rounded ${getDifficultyColor(difficulty_level)}`}>{difficulty_level}</div>
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
            <label htmlFor={`${question.id}-${idx}`} className="text-sm">{opt}</label>
          </li>
        ))}
      </ul>
      {!submitted && selected && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitted}
          className={theme.submitButton}
        >
          Submit
        </button>
      )}
      {submitted && (
        <div className="mt-4 space-y-1 text-sm">
          <div className="text-yellow-800 bg-yellow-50 border border-yellow-200 rounded p-2">
            Correct answer is: <span className="font-semibold">{options[correct_option_number - 1]}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function FillInTheBlank({ question, updateQuestionCount, theme }) {
  const { question_text, difficulty_level, correct_answer } = question.meta_data;
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {
      await submitQuestionAnswer({
        question_id: question.id,
        answer_text: answer,
      });
      updateQuestionCount(-1);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit answer:', err.message);
    }
  };

  return (
    <div className="relative mt-4 p-4 pb-8 rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex justify-between items-start mb-1">
        <MarkdownRenderer text={question_text} className={`${theme.questionText} pr-4`} />
        <div className={`shrink-0 px-2 py-0.5 text-xs rounded ${getDifficultyColor(difficulty_level)}`}>{difficulty_level}</div>
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
          disabled={submitted}
          className={theme.submitButton}
        >
          Submit
        </button>
      )}

      {submitted && (
        <div className="mt-4 space-y-1 text-sm">
          <div className="text-yellow-800 bg-yellow-50 border border-yellow-200 rounded p-2">
             Correct Answer is: <span className="font-semibold">{correct_answer}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SubjectiveQuestion({ question, updateQuestionCount, theme }) {
  const { question_text, difficulty_level, correct_answer } = question.meta_data;
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {
      await submitQuestionAnswer({
        question_id: question.id,
        answer_text: answer,
      });
      updateQuestionCount(-1);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit answer:', err.message);
    }
  };

  return (
    <div className="relative mt-4 p-4 pb-8 rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex justify-between items-start mb-1">
        <MarkdownRenderer text={question_text} className={`${theme.questionText} pr-4`} />
        <div className={`shrink-0 px-2 py-0.5 text-xs rounded ${getDifficultyColor(difficulty_level)}`}>{difficulty_level}</div>
      </div>
      <textarea
        rows={5}
        className={`${theme.inputfield} mb-2`}
        placeholder="Write your answer here"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={submitted}
      />
      {!submitted && answer.trim() && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitted}
          className={theme.submitButton}
        >
          Submit
        </button>
      )}
      {submitted && (
        <div className="mt-4 space-y-1 text-sm">
          <div className="text-yellow-800 bg-yellow-50 border border-yellow-200 rounded p-2">
             Correct Answer is: <span className="font-semibold">{correct_answer}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuestionView({ updateQuestionCount }) {
  const cfg = themeConfig.app;
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchUnattemptedQuestions();
      setQuestions(data);
    };
    load();
  }, []);


  const grouped = {
    mcq: questions.filter((q) => q.type === 'mcq'),
    fill: questions.filter((q) => q.type === 'fill_in_the_blanks'),
    subjective: questions.filter((q) => q.type === 'subjective'),
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-8 overflow-y-auto">
      {grouped.mcq.length > 0 && (
        <div>
          <div className={`${cfg.cardHeadingSecondary} mb-2`}>MCQ</div>
          {grouped.mcq.map((q) => (
            <MCQQuestion key={q.id} question={q} updateQuestionCount={updateQuestionCount} theme={cfg} />
          ))}
        </div>
      )}

      {grouped.fill.length > 0 && (
        <div>
          <div className={`${cfg.cardHeadingSecondary} mb-2`}>Fill in the Blank</div>
          {grouped.fill.map((q) => (
            <FillInTheBlank key={q.id} question={q} updateQuestionCount={updateQuestionCount} theme={cfg} />
          ))}
        </div>
      )}

      {grouped.subjective.length > 0 && (
        <div>
          <div className={`${cfg.cardHeadingSecondary} mb-2`}>Subjective</div>
          {grouped.subjective.map((q) => (
            <SubjectiveQuestion key={q.id} question={q} updateQuestionCount={updateQuestionCount} theme={cfg} />
          ))}
        </div>
      )}
    </div>
  );
}


