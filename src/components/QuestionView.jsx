// import React from 'react';
// import themeConfig from './themeConfig';

// const dummyQuestions = [
//     // MCQ - 4 questions
//     {
//       id: 1,
//       type: 'mcq',
//       question: 'What is the capital of Japan?',
//       options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'],
//     },
//     {
//       id: 2,
//       type: 'mcq',
//       question: 'Which planet is known as the Red Planet?',
//       options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
//     },
//     {
//       id: 3,
//       type: 'mcq',
//       question: 'Which gas do plants absorb from the atmosphere?',
//       options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Helium'],
//     },
//     {
//       id: 4,
//       type: 'mcq',
//       question: 'What is the largest ocean on Earth?',
//       options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
//     },
  
//     // Fill in the blanks - 2 questions
//     {
//       id: 5,
//       type: 'fill',
//       question: 'Light travels at a speed of ____ km/s.',
//     },
//     {
//       id: 6,
//       type: 'fill',
//       question: 'The square root of 144 is ____.',
//     },
  
//     // Subjective - 3 questions
//     {
//       id: 7,
//       type: 'subjective',
//       question: 'Describe the process of photosynthesis.',
//     },
//     {
//       id: 8,
//       type: 'subjective',
//       question: 'What are the main causes of climate change?',
//     },
//     {
//       id: 9,
//       type: 'subjective',
//       question: 'Explain Newton\'s laws of motion.',
//     },
//   ];
  

// // 🔹 MCQ Component
// function MCQQuestion({ question, theme }) {
//   return (
//     <div>
//       <div className={`${theme.cardHeadingSecondary}`}>MCQ</div>
//       <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
//         <p className="text-sm text-gray-700 mb-3">{question.question}</p>
//         <ul className="space-y-2">
//           {question.options.map((option, idx) => (
//             <li key={idx} className="flex items-center space-x-2">
//               <input type="radio" id={`${question.id}-${idx}`} name={`q-${question.id}`} />
//               <label htmlFor={`${question.id}-${idx}`} className="text-sm">{option}</label>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// // 🔹 Fill in the Blank Component
// function FillInTheBlank({ question, theme }) {
//   return (
//     <div >
//       <div className={`${theme.cardHeadingSecondary}`}>Fill in the Blank</div>
//       <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
//         <p className="text-sm text-gray-700 mb-3">{question.question}</p>
//         <input
//           type="text"
//           className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600"
//           placeholder="Your answer"
//         />
//       </div>
//     </div>
//   );
// }

// // 🔹 Subjective Component
// function SubjectiveQuestion({ question, theme }) {
//   return (
//     <div >
//       <div className={`${theme.cardHeadingSecondary}`}>Subjective</div>
//       <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
//         <p className="text-sm text-gray-700 mb-3">{question.question}</p>
//         <textarea
//           rows={4}
//           className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600"
//           placeholder="Write your answer here"
//         />
//       </div>
//     </div>
//   );
// }

// export default function QuestionView() {
//   const cfg = themeConfig;

//   return (
//     <div className="flex flex-col h-full p-4 space-y-6 overflow-y-auto">
//       {dummyQuestions.map((q) => {
//         if (q.type === 'mcq') return <MCQQuestion key={q.id} question={q} theme={cfg} />;
//         if (q.type === 'fill') return <FillInTheBlank key={q.id} question={q} theme={cfg} />;
//         if (q.type === 'subjective') return <SubjectiveQuestion key={q.id} question={q} theme={cfg} />;
//         return null;
//       })}
//     </div>
//   );
// }


import React from 'react';
import themeConfig from './themeConfig';

const dummyQuestions = [
  // MCQ - 4 questions
  {
    id: 1,
    type: 'mcq',
    question: 'What is the capital of Japan?',
    options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'],
  },
  {
    id: 2,
    type: 'mcq',
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
  },
  {
    id: 3,
    type: 'mcq',
    question: 'Which gas do plants absorb from the atmosphere?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Helium'],
  },
  {
    id: 4,
    type: 'mcq',
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
  },

  // Fill in the blanks - 2 questions
  {
    id: 5,
    type: 'fill',
    question: 'Light travels at a speed of ____ km/s.',
  },
  {
    id: 6,
    type: 'fill',
    question: 'The square root of 144 is ____.',
  },

  // Subjective - 3 questions
  {
    id: 7,
    type: 'subjective',
    question: 'Describe the process of photosynthesis.',
  },
  {
    id: 8,
    type: 'subjective',
    question: 'What are the main causes of climate change?',
  },
  {
    id: 9,
    type: 'subjective',
    question: "Explain Newton's laws of motion.",
  },
];

// 🔹 MCQ Component
function MCQQuestion({ question, theme }) {
  return (
    <div>
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

// 🔹 Subjective Component
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
  const cfg = themeConfig;

  const grouped = {
    mcq: dummyQuestions.filter((q) => q.type === 'mcq'),
    fill: dummyQuestions.filter((q) => q.type === 'fill'),
    subjective: dummyQuestions.filter((q) => q.type === 'subjective'),
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-8 overflow-y-auto">
      {/* MCQ Group */}
      {grouped.mcq.length > 0 && (
        <div>
          <div className={`${cfg.cardHeadingSecondary} mb-2`}>MCQ</div>
          {grouped.mcq.map((q) => (
            <MCQQuestion key={q.id} question={q} theme={cfg} />
          ))}
        </div>
      )}

      {/* Fill in the Blank Group */}
      {grouped.fill.length > 0 && (
        <div>
          <div className={`${cfg.cardHeadingSecondary} mb-2`}>Fill in the Blank</div>
          {grouped.fill.map((q) => (
            <FillInTheBlank key={q.id} question={q} />
          ))}
        </div>
      )}

      {/* Subjective Group */}
      {grouped.subjective.length > 0 && (
        <div>
          <div className={`${cfg.cardHeadingSecondary} mb-2`}>Subjective</div>
          {grouped.subjective.map((q) => (
            <SubjectiveQuestion key={q.id} question={q} />
          ))}
        </div>
      )}
    </div>
  );
}
