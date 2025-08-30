import { API_BASE_URL } from '../config/config';

function authHeaders() {
  const token = localStorage.getItem('token');
  const h = { 'Content-Type': 'application/json' };
  if (token) h.Authorization = token; 
  return h;
}

export async function ensureNote(tabId, payload) {
  const res = await fetch(`${API_BASE_URL}/notes/${tabId}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`ensureNote failed (${res.status}): ${text}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }
  return JSON.parse(text);
}

export async function fetchNote(tabId, noteId) {
  const res = await fetch(`${API_BASE_URL}/notes/${tabId}/${noteId}`, {
    method: 'GET',
    headers: authHeaders(),
  });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`fetchNote failed (${res.status}): ${text}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }
  return JSON.parse(text);
}

export async function updateNote(tabId, noteId, payload) {
  const res = await fetch(`${API_BASE_URL}/notes/${tabId}/${noteId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`updateNote failed (${res.status}): ${text}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }
  return JSON.parse(text);
}
