import { API_BASE_URL } from '../config/config';

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

export async function createTasks(tabId) {
  const res = await fetch(`${API_BASE_URL}/tasks/create`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ tab_id: Number(tabId) }),
  });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`createTasks failed (${res.status}): ${text}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }
  return JSON.parse(text);
}
