// services/roadmapService.js
import { useRef } from 'react';
import { API_BASE_URL, WS_BASE_URL } from '../config.js';

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
  
  // Case 1: There's a roadmapId in localStorage (user was creating roadmap before login)
  if (roadmapId && user?.id) {
    try {
      console.log('Assigning existing roadmap to user...', { roadmapId, userId: user.id });
      await assignRoadmapToUser(roadmapId, user.id, authToken);
      console.log('Roadmap assigned successfully');
      return true;
    } catch (error) {
      console.error('Failed to assign roadmap after login:', error);
    }
  }

  // Case 2: Check if user has existing roadmaps in the backend
  try {
    console.log('Checking for user existing roadmaps...', { userId: user.id });
    const existingRoadmap = await fetchUserRoadmaps(user.id, authToken);
    
    if (existingRoadmap) {
      console.log('Found existing roadmap for user:', existingRoadmap.id);
      localStorage.setItem('roadmapId', existingRoadmap.id.toString());
      return true;
    }
  } catch (error) {
    console.error('Failed to fetch user roadmaps after login:', error);
  }

  return false;
};

export const fetchRoadmapById = async (roadmapId, authToken = null) => {
  try {
    const headers = authToken ? { 'Authorization': authToken } : {};
    
    const response = await fetch(`${API_BASE_URL}/roadmaps?roadmap_id=${roadmapId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Roadmap not found
      }
      throw new Error(`Failed to fetch roadmap: ${response.status}`);
    }

    const data = await response.json();
    return data.roadmap;
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    return null;
  }
};


export const fetchUserRoadmaps = async (userId, authToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/roadmaps?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': authToken,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No roadmaps found
      }
      throw new Error(`Failed to fetch user roadmaps: ${response.status}`);
    }

    const data = await response.json();
    return data.roadmap; // Returns the roadmap object
  } catch (error) {
    console.error('Error fetching user roadmaps:', error);
    return null;
  }
};

export function useRoadmapWebSocket({ onMessage } = {}) {
  const wsRef = useRef(null);

  const connect = () => {
    if (wsRef.current) return; // avoid reconnecting if already connected

    const ws = new WebSocket(`${WS_BASE_URL}/ws/roadmap`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data?.chat_id) {
          try {
            localStorage.setItem('chatRoadmapId', data.chat_id);
          } catch (e) {
            console.warn('Failed to save chatRoadmapId to localStorage:', e);
          }
          return;
        }

        if (data.token !== undefined) {
          onMessage?.(data.token);
        } else {
          onMessage?.(data);
        }
      } catch (error) {
        console.warn('Failed to parse WebSocket message:', error);
        onMessage?.(event.data);
      }
    };

    ws.onopen = () => {
      console.log('[Roadmap WebSocket Connected]');
    };

    ws.onclose = () => {
      console.log('[Roadmap WebSocket Closed]');
      wsRef.current = null;
    };

    ws.onerror = (error) => {
      console.error('[Roadmap WebSocket Error]:', error);
    };
  };

  const close = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const sendMessage = (data) => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const chatRoadmapId = localStorage.getItem('chatRoadmapId');
        const payload = chatRoadmapId
          ? { ...data, chat_id: parseInt(chatRoadmapId, 10) }
          : data;

        wsRef.current.send(JSON.stringify(payload));
      } else {
        console.warn('WebSocket is not open. Ready state:', wsRef.current?.readyState);
      }
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
    }
  };

  return { connect, sendMessage, close };
}

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