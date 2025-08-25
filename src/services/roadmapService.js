// services/roadmapService.js
import { API_BASE_URL } from '../config.js';

export const assignRoadmapToUser = async (roadmapId, userId, authToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/roadmaps/user`, { // Note: matches your main.py route
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${authToken}`,
      },
      body: JSON.stringify({
        roadmap_id: parseInt(roadmapId),
        user_id: parseInt(userId),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to assign roadmap: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error assigning roadmap:', error);
    throw error;
  }
};

export const deleteRoadmap = async (roadmapId, authToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/roadmaps/${roadmapId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete roadmap: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting roadmap:', error);
    throw error;
  }
};

export const handlePostLoginRoadmapCheck = async (user, authToken) => {
  const roadmapId = localStorage.getItem('roadmapId');
  
  if (roadmapId && user?.id) {
    try {
      console.log('Assigning existing roadmap to user...', { roadmapId, userId: user.id });
      await assignRoadmapToUser(roadmapId, user.id, authToken);
      console.log('Roadmap assigned successfully');
    } catch (error) {
      console.error('Failed to assign roadmap after login:', error);
      // Don't throw - shouldn't break login flow
    }
  }
};