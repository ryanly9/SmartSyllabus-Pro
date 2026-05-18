'use client';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const auth = {
  setToken: (token) => {
    if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: () => {
    if (typeof window !== 'undefined') return localStorage.getItem(TOKEN_KEY);
    return null;
  },

  setUser: (user) => {
    if (typeof window !== 'undefined')
      localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: () => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem(USER_KEY);
      try { return u ? JSON.parse(u) : null; } catch { return null; }
    }
    return null;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(TOKEN_KEY);
    }
    return false;
  },

  getRole: () => {
    const user = auth.getUser();
    return user?.role || null;
  },

  isTeacher: () => ['teacher', 'admin'].includes(auth.getRole()),
  isStudent: () => auth.getRole() === 'student',
  isAdmin: () => auth.getRole() === 'admin',
};

export default auth;
