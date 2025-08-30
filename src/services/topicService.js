import { API_BASE_URL } from '../config.js';

export async function fetchActiveTopics(roadmapId) {
  try {
    const id = roadmapId ?? parseInt(localStorage.getItem('roadmapId') || '', 10);
    if (!id || Number.isNaN(id)) {
      return [];
    }
    const response = await fetch(`${API_BASE_URL}/topics?roadmap_id=${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch topics: ${response.status}`);
    }
    const data = await response.json();
    return data.topics || [];
  } catch (error) {
    console.error('Error fetching active topics:', error);
    return [];
  }
}
