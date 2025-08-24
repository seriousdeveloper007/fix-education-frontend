import { API_BASE_URL } from '../config.js';

export async function fetchRoadmapMessages(chatRoadmapId) {
  const token = localStorage.getItem('token');
  if (!chatRoadmapId) return [];

  const headers = token ? { Authorization: token } : {};

  try {
    const res = await fetch(`${API_BASE_URL}/messages/${chatRoadmapId}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch messages');
    const data = await res.json();
    return (data.messages || []).map((m) => ({
      role: m.message_from === 'assistant' ? 'agent' : 'user',
      text: m.text,
    }));
  } catch (err) {
    console.error('Error fetching roadmap messages:', err);
    return [];
  }
}
