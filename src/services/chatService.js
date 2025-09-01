import { API_BASE_URL } from '../config';
import { authHeaders } from '../utils/authUtils';

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

export async function loadChatMessages(chatId) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');
  
  const res = await fetch(`${API_BASE_URL}/messages/${chatId}`, {
    headers: authHeaders(),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to load messages: ${res.status}`);
  }
  
  return res.json();
}

export async function createChat(payload) {
  const res = await fetch(`${API_BASE_URL}/chats`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to create chat: ${res.status}`);
  }
  
  return res.json();
}

// Export all functions as named exports and as default object
export const chatService = {
  updateChat,
  loadChatMessages,
  createChat
};