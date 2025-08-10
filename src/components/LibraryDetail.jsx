import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PlatformNavbar from './PlatformNavbar';
import { fetchQuestions, submitQuestionAnswer } from '../services/questionService';
import { CheckCircle, AlertCircle } from 'lucide-react';
import DesktopOnly from './DesktopOnly';
import analytics from '../services/posthogService';
import themeConfig from './themeConfig';
import NoteView from './NoteView';


const getDifficultyColor = (level) => {
  if (level === 'easy') return 'bg-green-100 text-green-700';
  if (level === 'medium') return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};


function MCQCard({ question, onAnswerSubmit, isAttempted, theme }) {
    const [selected, setSelected] = useState(null);
    const [submitted, setSubmitted] = useState(isAttempted);
    const { question_text, option_1, option_2, option_3, option_4, difficulty_level, correct_option_number } = question.meta_data;
    const options = [option_1, option_2, option_3, option_4];


    useEffect(() => {
        if (isAttempted && question.answer?.answer_option) {
           setSelected(options[question.answer.answer_option - 1]);
        }
      }, [isAttempted, question]);
  
    const handleSubmit = async () => {
      if (selected !== null && !submitted) {
        await submitQuestionAnswer({
          question_id: question.id,
          answer_option: options.indexOf(selected) + 1,
        });
        setSubmitted(true);
        onAnswerSubmit?.();
      }
    };
  
    return (
      <div className="relative mt-4 p-4 pb-8 rounded-lg bg-gray-50 border border-gray-200 w-full">
        <div className="flex justify-between items-start mb-1">
          <div className="text-gray-800 text-sm pr-4 mb-3">{question_text}</div>
          <div className={`shrink-0 px-2 py-0.5 text-xs rounded ${getDifficultyColor(difficulty_level)}`}>{difficulty_level}</div>
        </div>
        <ul className="space-y-2">
          {options.map((opt, idx) => (
            <li key={idx} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`${question.id}-${idx}`}
                name={`q-${question.id}`}
                disabled={submitted}
                checked={selected === opt}
                onChange={() => setSelected(opt)}
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


  function FillInTheBlankCard({ question, onAnswerSubmit, isAttempted, theme }) {
    const [answer, setAnswer] = useState('');
    const [submitted, setSubmitted] = useState(isAttempted);
    const { question_text, difficulty_level, correct_answer } = question.meta_data;
  
    useEffect(() => {
        if (isAttempted && question.answer?.answer_text) {
          setAnswer(question.answer.answer_text);
        }
      }, [isAttempted, question]);
  
    const handleSubmit = async () => {
      if (!submitted) {
        await submitQuestionAnswer({
          question_id: question.id,
          answer_text: answer,
        });
        setSubmitted(true);
        onAnswerSubmit?.();
      }
    };
  
    return (
      <div className="relative mt-4 p-4 pb-8 rounded-lg bg-gray-50 border border-gray-200 w-full">
        <div className="flex justify-between items-start mb-1">
          <div className="text-gray-800 text-sm pr-4 mb-3">{question_text}</div>
          <div className={`shrink-0 px-2 py-0.5 text-xs rounded ${getDifficultyColor(difficulty_level)}`}>{difficulty_level}</div>
        </div>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-4"
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
  


function SubjectiveCard({ question, onAnswerSubmit, isAttempted , theme}) {
    console.log(question)
    const [answer, setAnswer] = useState('');
    const [submitted, setSubmitted] = useState(isAttempted);
    const { question_text, difficulty_level, correct_answer } = question.meta_data;
  
    useEffect(() => {
        if (isAttempted && question.answer?.answer_text) {
          setAnswer(question.answer.answer_text);
        }
      }, [isAttempted, question]);
      
  
    const handleSubmit = async () => {
      if (!submitted) {
        await submitQuestionAnswer({
          question_id: question.id,
          answer_text: answer,
        });
        setSubmitted(true);
        onAnswerSubmit?.();
      }
    };
  
    return (
      <div className="relative mt-4 p-4 pb-8 rounded-lg bg-gray-50 border border-gray-200 w-full">
        <div className="flex justify-between items-start mb-1">
          <div className="text-gray-800 text-sm pr-4 mb-3">{question_text}</div>
          <div className={`shrink-0 px-2 py-0.5 text-xs rounded ${getDifficultyColor(difficulty_level)}`}>{difficulty_level}</div>
        </div>
        <textarea
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
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
  

export default function LibraryDetail() {
  const { tabId } = useParams();
  const location = useLocation();
  const pageTitle = location.state?.pageTitle;
  const view = new URLSearchParams(location.search).get('view') || 'questions';

  const [attempted, setAttempted] = useState(0);
  const [unattempted, setUnattempted] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [attemptedQuestions, setAttemptedQuestions] = useState([]);
  const cfg = themeConfig.app;

  useEffect(() => {
    analytics.libraryDetailPageLoaded();
  }, []);

  useEffect(() => {
    if (view === 'notes') return;
    async function loadQuestions() {
      if (!tabId) return;
      const result = await fetchQuestions(tabId);
      setAttempted(result.attempted?.length || 0);
      setUnattempted(result.unattempted?.length || 0);
      setQuestions(result.unattempted || []);
      setAttemptedQuestions(result.attempted || []);
    }
    loadQuestions();
  }, [tabId, view]);

  const grouped = {
    mcq: questions.filter((q) => q.type === 'mcq'),
    fill: questions.filter((q) => q.type === 'fill_in_the_blanks'),
    subjective: questions.filter((q) => q.type === 'subjective'),
  };

  const groupedAttempted = {
    mcq: attemptedQuestions.filter((q) => q.type === 'mcq'),
    fill: attemptedQuestions.filter((q) => q.type === 'fill_in_the_blanks'),
    subjective: attemptedQuestions.filter((q) => q.type === 'subjective'),
  };

  const handleCountUpdate = () => {
    setAttempted((prev) => prev + 1);
    setUnattempted((prev) => Math.max(prev - 1, 0));
  };

  if (view === 'notes') {
    return (
      <DesktopOnly>
        <div className="min-h-screen bg-white flex flex-col font-fraunces">
          <PlatformNavbar defaultTab="Library" />

          <div className="flex justify-center mt-[60px] mb-[60px]">
            <div className="w-full max-w-4xl px-4">
              {pageTitle ? (
                <>
                  <div className="text-2xl font-medium text-black-500 mb-4 text-center">{pageTitle}</div>
                  <NoteView tabId={tabId} />
                </>
              ) : (
                <p className="text-red-500 text-center">
                  Page title not available. Please navigate from the Library page.
                </p>
              )}
            </div>
          </div>
        </div>
      </DesktopOnly>
    );
  }

  return (
    <DesktopOnly>
    <div className="min-h-screen bg-white flex flex-col font-fraunces">
      <PlatformNavbar defaultTab="Library" />

      <div className="flex justify-center mt-[60px] mb-[60px]">
        <div className="w-full max-w-4xl px-4">
          {pageTitle ? (
            <>
              <div className="text-2xl font-medium text-black-500 mb-4 text-center">{pageTitle}</div>

              <div className="flex gap-10 text-gray-700 mb-6 justify-center">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{attempted} Attempted Questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>{unattempted} Questions Left</span>
                </div>
              </div>

              {grouped.mcq.length > 0 && (
                <div className="mb-8">
                  <div className="text-lg font-semibold mb-2 text-gray-700">MCQ</div>
                  {grouped.mcq.map((q) => (
                    <MCQCard key={q.id} question={q} onAnswerSubmit={handleCountUpdate} theme={cfg} />
                  ))}
                </div>
              )}

              {grouped.fill.length > 0 && (
                <div className="mb-8">
                  <div className="text-lg font-semibold mb-2 text-gray-700">Fill in the Blank</div>
                  {grouped.fill.map((q) => (
                    <FillInTheBlankCard key={q.id} question={q} onAnswerSubmit={handleCountUpdate} theme={cfg} />
                  ))}
                </div>
              )}

              {grouped.subjective.length > 0 && (
                <div className="mb-8">
                  <div className="text-lg font-semibold mb-2 text-gray-700">Subjective</div>
                  {grouped.subjective.map((q) => (
                    <SubjectiveCard key={q.id} question={q} onAnswerSubmit={handleCountUpdate} theme={cfg} />
                  ))}
                </div>
              )}

              {(groupedAttempted.mcq.length > 0 ||
                groupedAttempted.fill.length > 0 ||
                groupedAttempted.subjective.length > 0) && (
                <div className="mt-10">
                  <div className="text-lg font-semibold mb-2 text-gray-700">Attempted Questions</div>

                  {groupedAttempted.mcq.length > 0 && (
                    <div className="mb-8">
                      <div className="text-base font-medium mb-2 text-gray-600">MCQ</div>
                      {groupedAttempted.mcq.map((q) => (
                        <MCQCard key={q.id} question={q} isAttempted theme={cfg} />
                      ))}
                    </div>
                  )}

                  {groupedAttempted.fill.length > 0 && (
                    <div className="mb-8">
                      <div className="text-base font-medium mb-2 text-gray-600">Fill in the Blank</div>
                      {groupedAttempted.fill.map((q) => (
                        <FillInTheBlankCard key={q.id} question={q} isAttempted theme={cfg} />
                      ))}
                    </div>
                  )}

                  {groupedAttempted.subjective.length > 0 && (
                    <div className="mb-8">
                      <div className="text-base font-medium mb-2 text-gray-600">Subjective</div>
                      {groupedAttempted.subjective.map((q) => (
                        <SubjectiveCard key={q.id} question={q} isAttempted theme={cfg} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-red-500 text-center">
              Page title not available. Please navigate from the Library page.
            </p>
          )}
        </div>
      </div>
    </div>
    </DesktopOnly>
  );
}
