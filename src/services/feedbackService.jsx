// services/feedbackService.js
import { API_BASE_URL } from '../config';

export async function submitFeedback(feedbackData) {
  try {
    const body = { ...feedbackData };
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        if (userObj && userObj.id != null) {
          body.user_id = userObj.id;
        }
      }
    } catch (_) {}

    const response = await fetch(`${API_BASE_URL}/send-feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}