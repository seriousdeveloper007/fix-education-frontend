import analytics from './posthogService';
import { API_BASE_URL } from '../config.js';

export async function fetchUnattemptedQuestions() {
  const token = localStorage.getItem('token');
  const tabId = localStorage.getItem('tabId');
  if (!token || !tabId) return [];

  try {
      const res = await fetch(`${API_BASE_URL}/questions/list/${tabId}`, {
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch questions');
    const data = await res.json();
    return data.unattempted || [];
  } catch (err) {
    console.error('Error fetching questions:', err);
    return [];
  }
}



export async function fetchQuestions(tabId) {
  const token = localStorage.getItem('token');
  if (!token || !tabId) return [];

  try {
      const res = await fetch(`${API_BASE_URL}/questions/list/${tabId}`, {
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch questions');
    const data = await res.json();
    return data
  } catch (err) {
    console.error('Error fetching questions:', err);
    return [];
  }
}


// In questionService.js
  export async function submitQuestionAnswer({ question_id, answer_text, answer_option }) {
    const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/question-answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
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

    const data = await response.json();
    analytics.questionAttempted(question_id);
    return data;
  }
