// JWT Token Management
export const getToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem('authToken', token);
    localStorage.setItem('isLoggedIn', 'true');
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Authentication Status
export const isAuthenticated = () => {
  try {
    const token = getToken();
    if (!token) return false;
    
    // Check if token is expired
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      // Token expired, remove it
      removeToken();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    removeToken();
    return false;
  }
};

// User Management
export const getCurrentUser = () => {
  try {
    const token = getToken();
    if (!token) return null;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      email: payload.email
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Login/Logout Functions
export const loginLocal = (token, userData = null) => {
  try {
    setToken(token);
    if (userData) {
      localStorage.setItem('userId', userData._id || userData.id);
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
};

export const logoutLocal = () => {
  try {
    removeToken();
    // Clear any other user-related data
    localStorage.removeItem('userData');
    localStorage.removeItem('recentlyViewed');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

// API Request Helper with JWT
export const apiRequest = async (url, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // Handle token expiration
  if (response.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Authentication required');
  }
  
  return response;
};

// Token Refresh (if needed)
export const refreshToken = async () => {
  try {
    const token = getToken();
    if (!token) return false;
    
    const response = await fetch('http://localhost:3900/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      setToken(data.data.token);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};


