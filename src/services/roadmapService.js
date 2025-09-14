import { API_BASE_URL } from '../config';

export async function createRoadmap(messageData) {
  try {
    const body = { message_data: messageData };

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

    return await response.json();
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

    return await response.json();
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    throw error;
  }
}

