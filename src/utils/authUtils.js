const TOKEN_KEY = "token";
const USER_KEY = "user";


export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}


export function setAuthInfo(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Clear auth info (logout / tampered / expired)
 
export function clearAuthInfo() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

 // Decode JWT safely (returns null if invalid)
 
function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    console.error("Invalid JWT:", e);
    return null;
  }
}

// Check if user is logged in (token exists)
 
export function isLoggedIn() {
  return Boolean(getToken());
}

// Check if authenticated (token + user valid, handle expiry if present)
 
export function getAuthInfo() {
  try {
    const token = getToken();
    const userStr = localStorage.getItem(USER_KEY);

    if (!token || !userStr) {
      clearAuthInfo();
      return { isAuthenticated: false, user: null, user_id: null, token: null };
    }

    const user = JSON.parse(userStr);
    if (!user?.id) {
      clearAuthInfo();
      return { isAuthenticated: false, user: null, user_id: null, token: null };
    }

    // Try decode JWT to check expiry if present
    const decoded = decodeJWT(token);
    if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
      console.warn("Token expired");
      clearAuthInfo();
      return { isAuthenticated: false, user: null, user_id: null, token: null };
    }

    return { isAuthenticated: true, user, user_id: user.id, token };
  } catch (e) {
    console.error("Error reading auth info:", e);
    clearAuthInfo();
    return { isAuthenticated: false, user: null, user_id: null, token: null };
  }
}

/**
 * Optional: validate session with backend
 * Call this when app loads or before sensitive actions
 */

export async function validateSession(apiEndpoint = "/api/validate-token") {
  const token = getToken();
  if (!token) {
    clearAuthInfo();
    return false;
  }

  try {
    const res = await fetch(apiEndpoint, {
      method: "GET",
      headers: authHeaders(),
    });

    if (!res.ok) {
      clearAuthInfo();
      return false;
    }

    return true;
  } catch (e) {
    console.error("Session validation failed:", e);
    return false;
  }
}


export function authHeaders(extraHeaders = {}) {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}
