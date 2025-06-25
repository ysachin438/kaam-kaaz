import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('token');
    if (authToken) {
      config.headers['auth_token'] = `Bearer ${authToken}`;
    }

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Auth
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Tasks
  getTasks: async (status = null) => {
    const url = status ? `/tasks?status=${status}` : '/tasks';
    const response = await api.get(url);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks/create', taskData);
    return response.data;
  },

  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}/update`, taskData);
    return response.data;
  },

  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}/delete`);
    return response.data;
  },

  // Users
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateUserProfile: async (userId, profileData) => {
    const response = await api.put(`/users/${userId}/update`, profileData);
    return response.data;
  },

  fetchCsrfToken: async () => {
    await api.get('/auth/csrf-token');
  }
};

export default api; 