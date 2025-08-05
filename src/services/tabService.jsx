export async function updateTab(lastPlaybackTime, videoDuration) {
    const token = localStorage.getItem('token');
    const tabId = localStorage.getItem('tabId');
    const user = JSON.parse(localStorage.getItem('user')); // user is saved as a dict
  
    if (!token || !tabId || !user?.id) {
      console.error("Missing required data in localStorage");
      return null;
    }
  
    try {
      const response = await fetch('http://localhost:8000/tabs', {
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
      const response = await fetch('http://localhost:8000/tabs/', {
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
      return data.tabs; // assuming your API returns { "tabs": [...] }
    } catch (error) {
      console.error('Error fetching tabs:', error);
      return null;
    }
  }
  