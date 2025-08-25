import { API_BASE_URL } from '../config.js';

export async function fetchRoadmapMessages(chatRoadmapId) {
  const token = localStorage.getItem('token');
  if (!chatRoadmapId) return [];

  const headers = token ? { Authorization: token } : {};

  try {
    const res = await fetch(`${API_BASE_URL}/messages/${chatRoadmapId}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch messages');
    const data = await res.json();
    return (data.messages || []).map((m) => ({
      role: m.message_from === 'assistant' ? 'agent' : 'user',
      text: m.text,
    }));
  } catch (err) {
    console.error('Error fetching roadmap messages:', err);
    return [];
  }
}

export const assignRoadmapToUser = async (roadmapId, userId, authToken) => {
  try {
    const response = await fetch('/api/roadmaps/user', {
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

export const handlePostLoginRoadmapCheck = async (user, authToken) => {
  const roadmapId = localStorage.getItem('roadmapId');
  
  if (roadmapId && user?.id) {
    try {
      console.log('Assigning existing roadmap to user...');
      await assignRoadmapToUser(roadmapId, user.id, authToken);
      console.log('Roadmap assigned successfully');
    } catch (error) {
      console.error('Failed to assign roadmap after login:', error);
      // Don't throw - shouldn't break login flow
    }
  }
};
// Add this to your service file
export const deleteRoadmap = async (roadmapId, authToken) => {
  try {
    const response = await fetch(`/api/roadmaps/${roadmapId}`, {
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