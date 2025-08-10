import { API_BASE_URL } from '../config.js';

function authHeadersMultipart() {
  const token = localStorage.getItem('token');
  const h = {};
  if (token) h.Authorization = token; // raw token
  return h;
}

// Upload a single image for a note; backend route assumed as /notes/{tab_id}/{note_id}/images
export async function uploadNoteImage(tabId, noteId, file) {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${API_BASE_URL}/notes/${tabId}/${noteId}/images`, {
    method: 'POST',
    headers: authHeadersMultipart(), // don't set Content-Type for multipart
    body: form,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`image upload failed (${res.status}): ${text}`);
  return JSON.parse(text);
}
