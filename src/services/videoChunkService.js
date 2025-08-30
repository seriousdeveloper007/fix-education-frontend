import { API_BASE_URL } from '../config/config';


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
  