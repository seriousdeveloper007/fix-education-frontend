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


export async function createRoadmap(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/create-roadmap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating roadmap:', error);
    throw error;
  }
}