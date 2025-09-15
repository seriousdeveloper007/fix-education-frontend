import { API_BASE_URL } from '../config';

export async function createMiniLesson(id) {

  const numericId = parseInt(id);
  const payload = { id: numericId };
  console.log("request payload",payload)
  
  try {
    const response = await fetch(`${API_BASE_URL}/mini-lesson/create-material`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Try to get detailed error message from response body
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorBody = await response.text();
        if (errorBody) {
          errorMessage += ` - ${errorBody}`;
        }
      } catch (parseError) {
        // If we can't parse the error body, use the basic message
        console.warn('Could not parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    // Handle network errors or other fetch-related issues
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Could not connect to the server');
    }
    
    // Re-throw other errors
    throw error;
  }
}
