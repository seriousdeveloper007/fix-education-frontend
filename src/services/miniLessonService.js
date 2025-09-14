import { API_BASE_URL } from '../config';

export async function createMiniLesson(miniLessonData) {
  const response = await fetch(`${API_BASE_URL}/mini-lesson`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(miniLessonData),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}
