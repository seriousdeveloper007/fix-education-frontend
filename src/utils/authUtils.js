export function isLoggedIn() {
    return Boolean(localStorage.getItem('token'));
  }
  
export function getAuthInfo() {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        if (user?.id) {
          return { isAuthenticated: true, user, user_id: user.id, token };
        }
      }
    } catch (e) {
      console.error("Error parsing user:", e);
    }
    return { isAuthenticated: false, user: null, user_id: null, token: null };
  }
  