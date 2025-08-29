// services/roadmapService.js
import { useRef, useEffect } from 'react';
import { API_BASE_URL, WS_BASE_URL } from '../config.js';


export const deleteRoadmap = async (roadmapId) => {
  try {
    const id = roadmapId ?? localStorage.getItem('roadmapId');
    if (!id) return;
    const response = await fetch(`${API_BASE_URL}/roadmaps/${id}`, {
      method: 'DELETE',
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


export function useRoadmapWebSocket({ onMessage } = {}) {
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);

  const connect = () => {
    if (wsRef.current) return; // avoid reconnecting if already connected

    const ws = new WebSocket(`${WS_BASE_URL}/ws/roadmap`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[Roadmap WebSocket Connected]');
    };

    ws.onmessage = (event) => {
      onMessage?.(event.data);
    };

    ws.onclose = () => {
      console.log('[Roadmap WebSocket Closed]');
      wsRef.current = null;

      // try reconnect after small delay
      reconnectTimerRef.current = setTimeout(() => {
        console.log('[Roadmap WebSocket Reconnecting...]');
        connect();
      }, 1000);
    };

    ws.onerror = (error) => {
      console.error('[Roadmap WebSocket Error]:', error);
      // close triggers onclose → reconnect
      ws.close();
    };
  };

  const close = () => {
    if (wsRef.current) {
      // prevent auto-reconnect when user explicitly closes
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
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

  // auto-connect once when hook is used
  useEffect(() => {
    connect();
    return () => close(); // cleanup on unmount
  }, []);

  return { connect, sendMessage, close };
}


export async function fetchRoadmapMessages() {
  const chat_id = localStorage.getItem('chatRoadmapId'); // fetch from localStorage

  if (!chat_id) return [];

  try {
    const res = await fetch(`${API_BASE_URL}/messages/${chat_id}`);
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


export async function fetchRoadmapAnalysis() {
  const { id: userId } = JSON.parse(localStorage.getItem('user') || '{}');
  const chatId = localStorage.getItem('chatRoadmapId');

  const fetchAnalysis = async (query) => {
    const res = await fetch(`${API_BASE_URL}/roadmaps/roadmap_analysis?${query}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch roadmap analysis');
    }
    const data = await res.json();
    return data.roadmap;
  };

  if (chatId) {
    const roadmap = await fetchAnalysis(`chat_id=${chatId}`);
    if (roadmap) return roadmap;
  }
  if (userId) {
    const roadmap = await fetchAnalysis(`user_id=${userId}`);
    if (roadmap) return roadmap;
  }
  return null;
}

export const updateRoadmap = async (updates = {}, roadmapId) => {
  try {
    const id =
      roadmapId ??
      parseInt(localStorage.getItem('roadmapId') || '', 10);

    if (!id || Number.isNaN(id)) {
      throw new Error('Missing or invalid roadmapId');
    }

    const res = await fetch(
      `${API_BASE_URL}/roadmaps/update?roadmap_id=${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to update roadmap: ${res.status}`);
    }

    const data = await res.json();
    return data.roadmap ?? data;
  } catch (error) {
    console.error('Error updating roadmap:', error);
    throw error;
  }
};