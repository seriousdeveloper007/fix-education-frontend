import axios from 'axios';
import { API_BASE_URL } from '../config.js'; // Assuming config.js has this

function authHeaders() {
  const token = localStorage.getItem('token');
  const h = { 'Content-Type': 'application/json' };
  if (token) h.Authorization = token; // Plain token, as per your curl
  return h;
}

export async function uploadImage(tabId, noteId, formData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/notes/${tabId}/${noteId}/images`, formData, {
      headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to upload image');
  }
}

export async function deleteImage(tabId, noteId, imageId) {
  try {
    await axios.delete(`${API_BASE_URL}/notes/${tabId}/${noteId}/images/${imageId}`, {
      headers: authHeaders(),
    });
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete image');
  }
}

export async function fetchImages(tabId, noteId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/notes/${tabId}/${noteId}/images`, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch images');
  }
}