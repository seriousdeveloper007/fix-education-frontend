import { API_BASE_URL } from '../config';

export async function createMiniLesson({ miniLesson, lessonName, miniLessonList }) {
  const response = await fetch(`${API_BASE_URL}/mini-lesson`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mini_lesson: miniLesson,
      lesson_name: lessonName,
      mini_lesson_list: miniLessonList,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}
