

import { API_BASE_URL } from '../config';

export async function getRoadmapStatus() {
  try {
    // Fast path: Check localStorage first
    const roadmapId = localStorage.getItem('roadmapId');
    if (roadmapId) {
      return { 
        has_roadmap: true, 
        roadmap_id: roadmapId,
        from_cache: true 
      };
    }

    // Slow path: Check database if no localStorage
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = token;

    const response = await fetch(`${API_BASE_URL}/roadmaps/status`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      return { has_roadmap: false, roadmap: null };
    }

    const data = await response.json();
    
    // Cache roadmap ID if found
    if (data.has_roadmap && data.roadmap?.id) {
      localStorage.setItem('roadmapId', data.roadmap.id.toString());
    }

    return data;
  } catch (error) {
    console.error('Error checking roadmap status:', error);
    
    // Fallback to localStorage if API fails
    const roadmapId = localStorage.getItem('roadmapId');
    if (roadmapId) {
      return { 
        has_roadmap: true, 
        roadmap_id: roadmapId,
        from_cache: true 
      };
    }
    
    return { has_roadmap: false, roadmap: null };
  }
}

/**
 * Create structured roadmap from chat message when user clicks mini-lesson
 * This finalizes the roadmap and transitions from chat to database storage
 */
export async function createRoadmapFromMessage(messageId, miniLessonTopic) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = token;

    const response = await fetch(`${API_BASE_URL}/roadmaps/create-from-message`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message_id: messageId,
        mini_lesson_topic: miniLessonTopic,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create roadmap: ${response.status} ${response.statusText}`);
    }

    const roadmap = await response.json();
    
    // Cache roadmap ID for future visits
    if (roadmap?.id) {
      localStorage.setItem('roadmapId', roadmap.id.toString());
    }

    return roadmap;
  } catch (error) {
    console.error('Error creating roadmap from message:', error);
    throw error;
  }
}

/**
 * Get complete roadmap data for display
 * Returns current/completed lessons from database + future lessons from payload
 */
export async function getUserRoadmapLessons() {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = token;

    const response = await fetch(`${API_BASE_URL}/roadmaps/user/lessons`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Clear invalid cached roadmap ID
        localStorage.removeItem('roadmapId');
        return null;
      }
      throw new Error(`Failed to fetch roadmap: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Ensure roadmap ID is cached
    if (data?.roadmap?.id) {
      localStorage.setItem('roadmapId', data.roadmap.id.toString());
    }

    return data;
  } catch (error) {
    console.error('Error fetching user roadmap lessons:', error);
    throw error;
  }
}

/**
 * Delete user's roadmap and start over
 * Soft deletes all roadmap data, allowing user to create new roadmap
 */
export async function deleteUserRoadmap() {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = token;

    const response = await fetch(`${API_BASE_URL}/roadmaps/user`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to delete roadmap: ${response.status} ${response.statusText}`);
    }

    // Clear cached roadmap ID
    localStorage.removeItem('roadmapId');
    
    // Also clear chat ID to start fresh
    localStorage.removeItem('chatStartLearningId');

    return true;
  } catch (error) {
    console.error('Error deleting user roadmap:', error);
    
    // Clear cache even if API call fails
    localStorage.removeItem('roadmapId');
    localStorage.removeItem('chatStartLearningId');
    
    throw error;
  }
}

/**
 * Mark a mini-lesson as completed
 * Automatically progresses to next lesson if all mini-lessons are completed
 */
export async function completeMiniLesson(miniLessonId) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = token;

    const response = await fetch(`${API_BASE_URL}/roadmaps/mini-lessons/${miniLessonId}/complete`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`Failed to complete mini-lesson: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error completing mini-lesson:', error);
    throw error;
  }
}

/**
 * Get mini-lesson ID by topic name
 * Helper function for URL transition from topic names to IDs
 */
export async function getMiniLessonByTopic(topicName) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = token;

    const response = await fetch(`${API_BASE_URL}/roadmaps/mini-lessons/by-topic/${encodeURIComponent(topicName)}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Mini-lesson not found
      }
      throw new Error(`Failed to find mini-lesson: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error finding mini-lesson by topic:', error);
    throw error;
  }
}