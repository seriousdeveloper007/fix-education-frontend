// import { API_BASE_URL } from '../config.js';

// function authHeaders() {
//   const token = localStorage.getItem('token');
//   const h = { 'Content-Type': 'application/json' };
//   if (token) h.Authorization = token; // raw token (no Bearer)
//   return h;
// }

// // Option A: create-or-get one note per (user, tab)
// export async function ensureNote(tabId, payload) {
//     console.log(payload)
//   const res = await fetch(`${API_BASE_URL}/notes/${tabId}`, {
//     method: 'POST',
//     headers: authHeaders(),
//     body: JSON.stringify(payload),
//   });
//   const text = await res.text();
//   if (!res.ok) throw new Error(`ensureNote failed (${res.status}): ${text}`);
//   return JSON.parse(text);
// }

// export async function updateNote(tabId, noteId, payload) {
//   const res = await fetch(`${API_BASE_URL}/notes/${tabId}/${noteId}`, {
//     method: 'PUT',
//     headers: authHeaders(),
//     body: JSON.stringify(payload),
//   });
//   const text = await res.text();
//   if (!res.ok) throw new Error(`updateNote failed (${res.status}): ${text}`);
//   return JSON.parse(text);
// }
import { API_BASE_URL } from '../config.js';

function authHeaders() {
  const token = localStorage.getItem('token');
  const h = { 'Content-Type': 'application/json' };
  if (token) h.Authorization = token; // backend expects raw token (no "Bearer ")
  return h;
}

// Create-or-get one note per (user, tab)
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
