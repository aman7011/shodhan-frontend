import axios from 'axios';

// Create axios instance for admin API calls
const adminApi = axios.create();

// Add request interceptor to include authentication
adminApi.interceptors.request.use(
  (config) => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth) {
      config.headers.Authorization = `Basic ${adminAuth}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored auth and redirect to login
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// Helper function to check if user is authenticated
export const isAdminAuthenticated = () => {
  return !!localStorage.getItem('adminAuth');
};

// Helper function to get admin user info
export const getAdminUser = () => {
  const userStr = localStorage.getItem('adminUser');
  return userStr ? JSON.parse(userStr) : null;
};

// Helper function to logout admin
export const logoutAdmin = () => {
  localStorage.removeItem('adminAuth');
  localStorage.removeItem('adminUser');
  window.location.href = '/admin';
};

// Helper function to get auth headers for manual requests
export const getAuthHeaders = () => {
  const adminAuth = localStorage.getItem('adminAuth');
  return adminAuth ? { 'Authorization': `Basic ${adminAuth}` } : {};
};

export default adminApi;