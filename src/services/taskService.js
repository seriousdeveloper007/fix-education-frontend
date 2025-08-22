import { API_BASE_URL } from '../config.js';

function authHeaders() {
  const token = localStorage.getItem('token');
  const h = { 'Content-Type': 'application/json' };
  if (token) h.Authorization = token;
  return h;
}

export async function fetchTasks(tabId) {
  const res = await fetch(`${API_BASE_URL}/tasks/list/${tabId}`, {
    method: 'GET',
    headers: authHeaders(),
  });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`fetchTasks failed (${res.status}): ${text}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }
  return JSON.parse(text);
}
