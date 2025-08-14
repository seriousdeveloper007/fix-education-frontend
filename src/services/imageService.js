import axios from 'axios';

export async function uploadImage(tabId, noteId, formData) {
  try {
    const response = await axios.post(`/api/notes/${tabId}/${noteId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to upload image');
  }
}

export async function deleteImage(tabId, noteId, imageId) {
  try {
    await axios.delete(`/api/notes/${tabId}/${noteId}/images/${imageId}`);
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete image');
  }
}

export async function fetchImages(tabId, noteId) {
  try {
    const response = await axios.get(`/api/notes/${tabId}/${noteId}/images`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch images');
  }
}