import { API_BASE_URL } from '../config.js';

export async function updateTab(lastPlaybackTime, videoDuration) {
    const token = localStorage.getItem('token');
    const tabId = localStorage.getItem('tabId');
    const user = JSON.parse(localStorage.getItem('user')); // user is saved as a dict
  
    if (!token || !tabId || !user?.id) {
      console.error("Missing required data in localStorage");
      return null;
    }
  
    try {
        const response = await fetch(`${API_BASE_URL}/tabs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          id: parseInt(tabId),
          user_id: user.id,
          last_playback_time: lastPlaybackTime,
          video_length: videoDuration,
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update tab');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error updating tab:', error);
      return null;
    }
  }


  export async function getTabs() {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('No auth token found');
      return null;
    }
  
    try {
        const response = await fetch(`${API_BASE_URL}/tabs/`, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch tabs');
      }
  
      const data = await response.json();
      console.log("tabs", data)
      return data.tabs; // assuming your API returns { "tabs": [...] }
    } catch (error) {
      console.error('Error fetching tabs:', error);
      return null;
    }
  }

  export async function createTab(userId, url, token) {
    const res = await fetch(`${API_BASE_URL}/tabs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,             // keep exactly as your backend expects
      },
      body: JSON.stringify({
        user_id: userId,
        captured_from_url: url,
      }),
    });
  
    if (!res.ok) {
      // Propagate a more descriptive error message
      const { message } = await res.json().catch(() => ({}));
      throw new Error(message || 'Failed to create tab');
    }
  
    const { tab } = await res.json();
    return tab;
  }
  

  export async function createVideoChunk(playbackTime) {
    console.log("playback time", playbackTime)
    const token = localStorage.getItem('token');
    const tabId = localStorage.getItem('tabId');
    if (!token || !tabId) return [];
  
    try {
        const res = await fetch(`${API_BASE_URL}/video_chunk/create`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chunk_to: playbackTime,
            tab_id: tabId, // ensure tabId is sent as an integer
        }),
      });
  
      if (!res.ok) throw new Error('Failed to fetch questions');
    } catch (err) {
      console.error('Error fetching questions:', err);
      return [];
    }
  }
  