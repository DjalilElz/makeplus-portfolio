import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLoading(false);
      return;
    }

    // Validate token format (JWT should have 3 parts separated by dots)
    if (typeof token !== 'string' || token.split('.').length !== 3) {
      console.warn('Invalid token format detected - clearing tokens');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(API_ENDPOINTS.ME);
      setUser(response.data.data);
    } catch (err) {
      console.warn('Auth check failed - clearing tokens');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      console.log('Attempting login to:', API_ENDPOINTS.LOGIN);
      console.log('With credentials:', { email, password: '***' });
      
      const response = await axios.post(API_ENDPOINTS.LOGIN, { email, password });
      console.log('Login response:', response.data);
      
      const { token, admin } = response.data.data;
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(admin));
      setUser(admin);
      
      return { success: true };
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
      });
      
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your connection.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await axios.post(API_ENDPOINTS.LOGOUT);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
