import { API_BASE_URL } from '../config';

export async function createRoadmap(messageData) {
  try {
    const body = messageData
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        if (userObj && userObj.id != null) {
          body.user_id = userObj.id;
        }
      }
    } catch (_) { }

    const response = await fetch(`${API_BASE_URL}/create-roadmap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result && result.roadmap_id != null) {
      try { localStorage.setItem('roadmap_id', String(result.roadmap_id)); } catch (_) {}
    }
    return result;
  } catch (error) {
    console.error('Error creating roadmap:', error);
    throw error;
  }
}

export async function fetchRoadmap(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/find-roadmap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result && result.roadmap_id != null) {
      try { localStorage.setItem('roadmap_id', String(result.roadmap_id)); } catch (_) {}
    }
    return result;
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    throw error;
  }
}

export async function updateRoadmapUserId(userId) {
  try {
    let roadmapId = null;
    try {
      const stored = localStorage.getItem('roadmap_id');
      if (stored != null && stored !== '') {
        roadmapId = Number(stored);
      }
    } catch (_) {}

    if (roadmapId == null || Number.isNaN(roadmapId)) {
      return { skipped: true, reason: 'No existing roadmap found to update' };
    }

    const response = await fetch(`${API_BASE_URL}/update-roadmap`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roadmap_id: roadmapId, user_id: userId }),
    });

    if (!response.ok) {
      let errorDetail = null;
      try { errorDetail = (await response.json()).detail; } catch (_) {}
      throw new Error(errorDetail || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating roadmap user id:', error);
    throw error;
  }
}

