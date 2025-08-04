const API_BASE_URL = 'http://localhost:8000';

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
