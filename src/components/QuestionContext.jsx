import React, { createContext, useContext, useState } from 'react';

const QuestionsContext = createContext({
  questions: { mcq: [], fill: [], subjective: [] },
  setQuestions: () => {},
});

export function QuestionsProvider({ children }) {
  const [questions, setQuestions] = useState({ mcq: [], fill: [], subjective: [] });
  return (
    <QuestionsContext.Provider value={{ questions, setQuestions }}>
      {children}
    </QuestionsContext.Provider>
  );
}

export const useQuestions = () => useContext(QuestionsContext);
