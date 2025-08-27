import { useCallback } from 'react';

export function useAuth() {

  const getAuthInfo = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        if (user && user.id) {
          return {
            isAuthenticated: true,
            user,
            user_id: user.id,
            token
          };
        }
      }
    } catch (error) {
      console.error('Error getting auth data:', error);
    }
    
    return {
      isAuthenticated: false,
      user: null,
      user_id: null,
      token: null
    };
  }, []);

  const isLoggedIn = useCallback(() => {
    return Boolean(localStorage.getItem('token'));
  }, []);

  return {
    getAuthInfo,
    isLoggedIn,
  };
}