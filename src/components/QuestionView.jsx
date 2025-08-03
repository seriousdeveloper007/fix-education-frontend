import themeConfig from './themeConfig';
import { useQuestions } from './QuestionContext.jsx';

function MCQQuestion({ question }) {
  return (
    <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
      <p className="text-sm text-gray-700 mb-3">{question.question}</p>
      <ul className="space-y-2">
        {(question.options || []).map((option, idx) => (
          <li key={idx} className="flex items-center space-x-2">
            <input type="radio" id={`mcq-${idx}`} name={`mcq-${question.id || 0}`} />
            <label htmlFor={`mcq-${idx}`} className="text-sm">{option}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FillInTheBlank({ question }) {
  return (
    <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
      <p className="text-sm text-gray-700 mb-3">{question.question}</p>
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600"
        placeholder="Your answer"
      />
    </div>
  );
}

function SubjectiveQuestion({ question }) {
  return (
    <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
      <p className="text-sm text-gray-700 mb-3">{question.question}</p>
      <textarea
        rows={4}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600"
        placeholder="Write your answer here"
      />
    </div>
  );
}

export default function QuestionView() {
  const cfg = themeConfig.app;
  const { questions } = useQuestions();
  const { mcq = [], fill = [], subjective = [] } = questions;

  return (
    <div className="flex flex-col h-full p-4 space-y-8 overflow-y-auto">
      {mcq.length > 0 && (
        <div>
          <div className={`${cfg.cardHeadingSecondary} mb-2`}>MCQ</div>
          {mcq.map((q, idx) => (
            <MCQQuestion key={idx} question={q} />
          ))}
        </div>
      )}

      {fill.length > 0 && (
        <div>
          <div className={`${cfg.cardHeadingSecondary} mb-2`}>Fill in the Blank</div>
          {fill.map((q, idx) => (
            <FillInTheBlank key={idx} question={q} />
          ))}
        </div>
      )}

      {subjective.length > 0 && (
        <div>
          <div className={`${cfg.cardHeadingSecondary} mb-2`}>Subjective</div>
          {subjective.map((q, idx) => (
            <SubjectiveQuestion key={idx} question={q} />
          ))}
        </div>
      )}
    </div>
  );
}
