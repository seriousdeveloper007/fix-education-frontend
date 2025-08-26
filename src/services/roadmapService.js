// src/services/roadmapService.js
import { API_BASE_URL } from '../config.js';


export async function getRoadmap() {
  // Read IDs from localStorage
  const { id: userId } = JSON.parse(localStorage.getItem('user') || '{}');
  const chatRoadmapIdStr = localStorage.getItem('chatRoadmapId');

  // Prefer userId, else fallback to chatRoadmapID
  const chatRoadmapID = chatRoadmapIdStr ? Number.parseInt(chatRoadmapIdStr, 10) : null;

  const qs = new URLSearchParams();
  if (Number.isInteger(userId)) {
    qs.set('user_id', String(userId));
  } else if (Number.isInteger(chatRoadmapID)) {
    qs.set('chat_id', String(chatRoadmapID));
  } else {
    console.error('getRoadmap: expected userId or chatRoadmapID in localStorage');
    return null;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/roadmaps?${qs.toString()}`, {
      method: 'GET',
    });

    if (!res.ok) {
      let detail = 'Failed to fetch roadmap';
      try {
        const err = await res.json();
        detail = err?.detail || detail;
      } catch {
        /* ignore JSON parse errors */
      }
      throw new Error(detail);
    }

    const data = await res.json(); // { roadmap: { ... } }
    return data?.roadmap ?? null;
  } catch (err) {
    console.error('Error fetching roadmap:', err);
    return null;
  }
}
