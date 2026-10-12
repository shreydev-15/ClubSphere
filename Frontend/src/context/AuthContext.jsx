import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize session from server cookie
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authService.getMe();
      if (res && res.user) {
        setUser({
          ...res.user,
          id: res.user.id || res.user._id,
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async ({ email, password }) => {
    setAuthError(null);
    const data = await authService.login({ email, password });
    if (data?.user) {
      const userData = {
        ...data.user,
        id: data.user.id || data.user._id,
      };
      setUser(userData);
      return userData;
    }
    return data;
  };

  const register = async ({ email, firstname, lastname, password }) => {
    setAuthError(null);
    const data = await authService.register({ email, firstname, lastname, password });
    if (data?.user) {
      const userData = {
        ...data.user,
        id: data.user.id || data.user._id,
      };
      setUser(userData);
      return userData;
    }
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    refreshUser: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
