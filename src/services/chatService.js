import { API_BASE_URL } from '../config';

export async function attachUserToStartLearningChat(userId) {
  try {
 

    const chatId = localStorage.getItem('chatStartLearningId');
    if (!chatId) return;

    const endpoint = `${API_BASE_URL}/chats/${encodeURIComponent(chatId)}/user`;
    const payload = { user_id: userId };

    const headers = { 'Content-Type': 'application/json' };
    try {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = token;
    } catch (_) {}

    await fetch(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch (_) {}
}

export async function fetchStartLearningChatMessages(chatId) {
  if (!chatId) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/messages/chat/${encodeURIComponent(chatId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data;
  } catch (_) {
    return [];
  }
} 
export async function findLatestChatStartLearningId (userId)  {
  try {
    const headers = { 'Content-Type': 'application/json' };
    
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch('http://localhost:8000/chats/latest', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        user_id: userId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.chat_id; // Returns the chat_id or null
  } catch (error) {
    console.error('Error fetching latest chat:', error);
    return null;
  }
};
