import axios from 'axios';

// Use environment variable in production, localhost in development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyEmail: (token) => api.get(`/auth/verify?token=${token}`),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
};

// Account API calls
export const accountApi = {
  getAll: () => api.get('/accounts'),
  getById: (id) => api.get(`/accounts/${id}`),
  create: (data) => api.post('/accounts', data),
  update: (id, data) => api.put(`/accounts/${id}`, data),
  delete: (id) => api.delete(`/accounts/${id}`),
  getBalance: (id) => api.get(`/accounts/${id}/balance`),
};

// Category API calls
export const categoryApi = {
  getAll: () => api.get('/categories'),
  getByType: (type) => api.get(`/categories?type=${type}`),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Transaction API calls
export const transactionApi = {
  getAll: (params) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  getSummary: () => api.get('/transactions/summary'),
  getByCategory: () => api.get('/transactions/by-category'),
};

// Budget API calls
export const budgetAPI = {
  getAll: () => api.get('/budgets'),
  getCurrent: () => api.get('/budgets/current'),
  getByMonth: (month, year) => api.get(`/budgets?month=${month}&year=${year}`),
  getById: (id) => api.get(`/budgets/${id}`),
  create: (data) => api.post('/budgets', data),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
};

// Analytics API calls
export const analyticsAPI = {
  getMonthlyTrends: (months = 6) => api.get(`/analytics/monthly-trends?months=${months}`),
  getCategoryTrends: (months = 6) => api.get(`/analytics/category-trends?months=${months}`),
  getTopSpendingMonths: (limit = 5) => api.get(`/analytics/top-spending-months?limit=${limit}`),
};

export default api;