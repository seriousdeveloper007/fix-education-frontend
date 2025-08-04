import React, { useEffect, useState } from 'react';
import themeConfig from './themeConfig';
import { fetchUnattemptedQuestions } from '../services/questionService';
import { SendHorizontal } from 'lucide-react';


function Snackbar({ message, visible }) {
  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 z-50
        ${visible ? 'bg-green-100 text-green-700 opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {message}
    </div>
  );
}


const getDifficultyColor = (level) => {
  if (level === 'easy') return 'bg-green-100 text-green-700';
  if (level === 'medium') return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};


async function submitQuestionAnswer({ question_id, answer_text, answer_option }) {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/question-answers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`, // pass token here
    },
    body: JSON.stringify({
      question_id,
      answer_text,
      answer_option,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to submit answer');
  }

  return await response.json();
}

const handleTextAnswerSubmit = async (questionId, answer, updateQuestionCount) => {
  try {
    await submitQuestionAnswer({
      question_id: questionId,
      answer_text: answer,
    });
    updateQuestionCount(-1);
    onSuccessfulSubmit(question.id);
    showSnackbar();
  } catch (err) {
    console.error('Failed to submit answer:', err.message);
  }
};


function MCQQuestion({ question , updateQuestionCount, theme, showSnackbar, onSuccessfulSubmit}) {
  const { question_text, option_1, option_2, option_3, option_4 , difficulty_level} = question.meta_data;
  const options = [option_1, option_2, option_3, option_4];
  const [selected, setSelected] = useState(null);

  const handleSubmit = async () => {
    if (selected !== null) {
      try {
        await submitQuestionAnswer({
          question_id: question.id,
          answer_option: options.indexOf(selected) + 1,
        });
        updateQuestionCount(-1);
        onSuccessfulSubmit(question.id);
        showSnackbar();
      } catch (err) {
        console.error('Failed to submit answer:', err.message);
      }
    }
  };

  

  return (
    <div className="relative mt-4 p-4 pb-8 rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex justify-between items-start mb-1">
        <div className={`${theme.questionText} pr-4`}>{question_text}</div>
        <div className={`shrink-0 px-2 py-0.5 text-xs rounded ${getDifficultyColor(difficulty_level)}`}>
          {difficulty_level}
        </div>
      </div>
      <ul className="space-y-2">
        {options.map((opt, idx) => (
          <li key={idx} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`${question.id}-${idx}`}
              name={`q-${question.id}`}
              onChange={() => setSelected(opt)}
            />
            <label htmlFor={`${question.id}-${idx}`} className="text-sm">{opt}</label>
          </li>
        ))}
      </ul>
      {selected && (
        <SendHorizontal
          size={20}
          className="absolute bottom-4 right-4 text-cyan-600 cursor-pointer hover:scale-110 transition-transform"
          onClick={handleSubmit}
        />
      )}
    </div>
  );
}


function FillInTheBlank({ question, updateQuestionCount, theme , showSnackbar, onSuccessfulSubmit}) {
  const { question_text, difficulty_level } = question.meta_data;
  const [answer, setAnswer] = useState('');

  return (
    <div className="relative mt-4 p-4 pb-8 rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex justify-between items-start mb-1">
        <div className={`${theme.questionText} pr-4`}>{question_text}</div>
        <div className={`shrink-0 px-2 py-0.5 text-xs rounded ${getDifficultyColor(difficulty_level)}`}>
          {difficulty_level}
        </div>
      </div>
      <input
        type="text"
        className={`${theme.inputfield} mb-2`}
        placeholder="Your answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      {answer.trim() && (
        <SendHorizontal
          size={20}
          className="absolute bottom-4 right-4 text-cyan-600 cursor-pointer hover:scale-110 transition-transform"
          onClick={async () => {
            await handleTextAnswerSubmit(question.id, answer, updateQuestionCount);
            showSnackbar();
            onSuccessfulSubmit(question.id);
          }}
        />
      )}
    </div>
  );
}


function SubjectiveQuestion({ question, updateQuestionCount, theme , showSnackbar, onSuccessfulSubmit}) {
  const { question_text, difficulty_level } = question.meta_data;
  const [answer, setAnswer] = useState('');

  return (
    <div className="relative mt-4 p-4 pb-8 rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex justify-between items-start mb-1">
        <div className={`${theme.questionText} pr-4`}>{question_text}</div>
        <div className={`shrink-0 px-2 py-0.5 text-xs rounded ${getDifficultyColor(difficulty_level)}`}>
          {difficulty_level}
        </div>
      </div>
      <textarea
        rows={5}
        className={`${theme.inputfield} mb-2`}
        placeholder="Write your answer here"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      {answer.trim() && (
        <SendHorizontal
          size={20}
          className="absolute bottom-4 right-4 text-cyan-600 cursor-pointer hover:scale-110 transition-transform"
          onClick={async () => {
            await handleTextAnswerSubmit(question.id, answer, updateQuestionCount);
            showSnackbar();
            onSuccessfulSubmit(question.id);
          }}
        />
      )}
    </div>
  );
}


export default function QuestionView({updateQuestionCount}) {
  const cfg = themeConfig.app;
  const [questions, setQuestions] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [exitingQuestionIds, setExitingQuestionIds] = useState([]);


  useEffect(() => {
    const load = async () => {
      const data = await fetchUnattemptedQuestions();
      setQuestions(data);
    };

    load();
  }, []);

  const showSnackbar = () => {
    setSnackbarVisible(true);
    setTimeout(() => setSnackbarVisible(false), 3000); // Auto-hide after 3 seconds
  };

  const onSuccessfulSubmit = (questionId) => {
    setExitingQuestionIds((prev) => [...prev, questionId]);
  
    setTimeout(() => {
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      setExitingQuestionIds((prev) => prev.filter((id) => id !== questionId));
    }, 300); // Match with CSS transition duration
  };
  

  const grouped = {
    mcq: questions.filter((q) => q.type === 'mcq'),
    fill: questions.filter((q) => q.type === 'fill_in_the_blanks'),
    subjective: questions.filter((q) => q.type === 'subjective'),
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-8 overflow-y-auto">
      <Snackbar message="Response saved, will share feedback soon!" visible={snackbarVisible} />
      {grouped.mcq.length > 0 && (
        <div>
          <div className={`${cfg.cardHeadingSecondary} mb-2`}>MCQ</div>
          {grouped.mcq.map((q) => (
            <MCQQuestion key={q.id} question={q} updateQuestionCount={updateQuestionCount} theme={cfg} showSnackbar={showSnackbar} onSuccessfulSubmit={onSuccessfulSubmit} />
          ))}
        </div>
      )}

      {grouped.fill.length > 0 && (
        <div>
          <div className={`${cfg.cardHeadingSecondary} mb-2`}>Fill in the Blank</div>
          {grouped.fill.map((q) => (
            <FillInTheBlank key={q.id} question={q} updateQuestionCount={updateQuestionCount} theme={cfg} showSnackbar={showSnackbar} onSuccessfulSubmit={onSuccessfulSubmit} />
          ))}
        </div>
      )}

      {grouped.subjective.length > 0 && (
        <div>
          <div className={`${cfg.cardHeadingSecondary} mb-2`}>Subjective</div>
          {grouped.subjective.map((q) => (
            <SubjectiveQuestion key={q.id} question={q} updateQuestionCount={updateQuestionCount} theme={cfg} showSnackbar={showSnackbar} onSuccessfulSubmit={onSuccessfulSubmit} />
          ))}
        </div>
      )}
    </div>
  );
}
