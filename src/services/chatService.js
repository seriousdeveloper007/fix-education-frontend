import { API_BASE_URL } from '../config/config';

function authHeaders() {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = token;
  return headers;
}

// Update chat when a chat ID exists in localStorage
export async function updateChat(payload) {
  const chatRoadmapId = localStorage.getItem('chatRoadmapId');
  const chatId = localStorage.getItem('chatId');
  const id = chatRoadmapId || chatId;
  if (!id) return null;

  const res = await fetch(`${API_BASE_URL}/chats/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`updateChat failed (${res.status}): ${text}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }

  const data = JSON.parse(text);
  return data.chat;
}

