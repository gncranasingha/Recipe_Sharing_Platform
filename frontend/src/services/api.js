import axios from 'axios';

const api = axios.create({
  baseURL: 'https://67f287c9ec56ec1a36d35d40.mockapi.io/api/v1',
});

// Request interceptor to add auth token if available
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Update the updateUserFavorites function in api.js
export const updateUserFavorites = async (userId, favorites) => {
  try {
    // First get the current user data
    const { data: user } = await api.get(`/auth/${userId}`);
    
    // Then update with the new favorites while preserving other fields
    const response = await api.put(`/auth/${userId}`, {
      ...user, // spread all existing user data
      favorites // update just the favorites array
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};


export default api;



