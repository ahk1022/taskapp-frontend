import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://13.210.143.91:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  getReferrals: () => api.get('/auth/referrals'),
};

// Package API
export const packageAPI = {
  getAll: () => api.get('/packages'),
  getOne: (id) => api.get(`/packages/${id}`),
  purchase: (data) => api.post('/packages/purchase', data),
};

// Task API
export const taskAPI = {
  getAvailable: () => api.get('/tasks/available'),
  start: (taskId) => api.post('/tasks/start', { taskId }),
  complete: (userTaskId) => api.post('/tasks/complete', { userTaskId }),
  getHistory: () => api.get('/tasks/history'),
};

// Withdrawal API
export const withdrawalAPI = {
  request: (data) => api.post('/withdrawals/request', data),
  getAll: () => api.get('/withdrawals'),
};

// Transaction API
export const transactionAPI = {
  getAll: (type) => api.get('/transactions', { params: { type } }),
  getStats: () => api.get('/transactions/stats'),
};

export default api;
