import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
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
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Chat API
export const chatAPI = {
  sendMessage: (message) => api.post('/chat/message', { message }),
  getWorkoutPlan: () => api.post('/chat/workout-plan'),
  getExercises: (data) => api.post('/chat/exercises', data),
  getHistory: () => api.get('/chat/history'),
  clearHistory: () => api.delete('/chat/history')
};

// Workout API
export const workoutAPI = {
  logWorkout: (data) => api.post('/workouts/log', data),
  getHistory: (page = 1, limit = 20) => api.get(`/workouts/history?page=${page}&limit=${limit}`),
  getStats: () => api.get('/workouts/stats'),
  getWorkout: (id) => api.get(`/workouts/${id}`),
  deleteWorkout: (id) => api.delete(`/workouts/${id}`)
};

export default api;
