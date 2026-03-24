import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdmin = (user) => {
    if (!user) return false;
    const role = user.role || user.authorities?.[0]?.authority || '';
    return role === 'ADMIN' || role === 'admin' || role === 'ROLE_ADMIN';
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getUser();
      const isLoggedIn = authService.isAuthenticated();

      if (isLoggedIn && storedUser) {
        setCurrentUser(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(checkAdmin(storedUser));

        try {
          const freshUser = await authService.getCurrentUser();
          if (freshUser) {
            setCurrentUser(freshUser);
            setIsAdmin(checkAdmin(freshUser));
          }
        } catch (error) {
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setCurrentUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
          }
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      setIsAdmin(checkAdmin(response.user));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.error || 'Login failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      await authService.register(userData);
      const loginResult = await login({ email: userData.email, password: userData.password });
      return loginResult;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.error || 'Registration failed',
        errors: error.response?.data?.errors,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsLoading(false);
    }
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    currentUser,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
