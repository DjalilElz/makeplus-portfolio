import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    
    // Handle authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid
      console.warn('Authentication failed - clearing token and redirecting to login');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    
    // Handle bad requests related to invalid token format
    if (error.response?.status === 400 && error.response?.data?.message?.includes('token')) {
      console.warn('Invalid token format - clearing token and redirecting to login');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
