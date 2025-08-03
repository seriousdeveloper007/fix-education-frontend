// import themeConfig from './themeConfig';


// const dummyQuestions = [
//     {
//       id: 1,
//       type: 'mcq',
//       question: 'What is the capital of France?',
//       options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
//       answer: 'Paris',
//     },
//     {
//       id: 2,
//       type: 'fill',
//       question: 'The chemical symbol for water is ____.',
//       answer: 'H2O',
//     },
//     {
//       id: 3,
//       type: 'subjective',
//       question: 'Explain the theory of relativity.',
//       answer: '',
//     },
//   ];
  


// export default function QuestionView(){
//     return (
//         <div className="flex flex-col h-full">
//            <p>inside question view</p>
//         </div>
//     );
// }
import React from 'react';
import themeConfig from './themeConfig';

const dummyQuestions = [
  {
    id: 1,
    type: 'mcq',
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
  },
  {
    id: 2,
    type: 'fill',
    question: 'The chemical symbol for water is ____.',
  },
  {
    id: 3,
    type: 'subjective',
    question: 'Explain the theory of relativity.',
  },
];

// 🔹 MCQ Component
function MCQQuestion({ question, cardClass }) {
  return (
    <div className={cardClass}>
      <div className="text-base sm:text-lg font-medium text-black-400">MCQ</div>
      <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
        <p className="text-sm text-gray-700 mb-3">{question.question}</p>
        <ul className="space-y-2">
          {question.options.map((option, idx) => (
            <li key={idx} className="flex items-center space-x-2">
              <input type="radio" id={`${question.id}-${idx}`} name={`q-${question.id}`} />
              <label htmlFor={`${question.id}-${idx}`} className="text-sm">{option}</label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// 🔹 Fill in the Blank Component
function FillInTheBlank({ question, cardClass }) {
  return (
    <div className={cardClass}>
      <div className="text-base sm:text-lg font-medium text-black-400">Fill in the Blank</div>
      <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
        <p className="text-sm text-gray-700 mb-3">{question.question}</p>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600"
          placeholder="Your answer"
        />
      </div>
    </div>
  );
}

// 🔹 Subjective Component
function SubjectiveQuestion({ question, cardClass }) {
  return (
    <div className={cardClass}>
      <div className="text-base sm:text-lg font-medium text-black-400">Subjective</div>
      <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
        <p className="text-sm text-gray-700 mb-3">{question.question}</p>
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600"
          placeholder="Write your answer here"
        />
      </div>
    </div>
  );
}

export default function QuestionView() {
  const cfg = themeConfig;
  const cardClass = cfg.card;

  return (
    <div className="flex flex-col h-full p-4 space-y-6 overflow-y-auto">
      {dummyQuestions.map((q) => {
        if (q.type === 'mcq') return <MCQQuestion key={q.id} question={q} cardClass={cardClass} />;
        if (q.type === 'fill') return <FillInTheBlank key={q.id} question={q} cardClass={cardClass} />;
        if (q.type === 'subjective') return <SubjectiveQuestion key={q.id} question={q} cardClass={cardClass} />;
        return null;
      })}
    </div>
  );
}