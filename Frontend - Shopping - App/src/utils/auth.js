export const isAuthenticated = () => {
  try {
    return localStorage.getItem('isLoggedIn') === 'true';
  } catch {
    return false;
  }
};

export const loginLocal = (tokenLikeValue) => {
  try {
    localStorage.setItem('isLoggedIn', 'true');
    if (tokenLikeValue) {
      localStorage.setItem('authToken', tokenLikeValue);
    }
  } catch {}
};

export const logoutLocal = () => {
  try {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
  } catch {}
};


