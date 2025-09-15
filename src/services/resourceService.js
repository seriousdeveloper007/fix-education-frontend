const API_BASE_URL = 'http://localhost:8000';

export const findResources = async (mini_lesson_name, mini_lesson_id, max_resources = 4, difficulty_preference = null) => {
  try {
    const requestBody = {
      mini_lesson_name,
      mini_lesson_id,
      max_resources
    };

    if (difficulty_preference) {
      requestBody.difficulty_preference = difficulty_preference;
    }

    const response = await fetch(`${API_BASE_URL}/resources/find`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error finding resources:', error);
    throw error;
  }
};