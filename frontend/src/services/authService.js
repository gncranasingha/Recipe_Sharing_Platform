import api from './api';

export const login = async (email, password) => {
  try {
    // Get all users from mock API
    const response = await api.get('/auth');
    const users = response.data;
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // For mock purposes, we'll just return the user data
    // In a real app, you'd get a token from the API
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      // Mock token for demonstration
      token: 'mock-token-for-user-' + user.id
    };
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    // Check if email already exists
    const response = await api.get('/auth');
    const users = response.data;
    
    const emailExists = users.some(u => u.email === userData.email);
    if (emailExists) {
      throw new Error('Email already registered');
    }
    
    // Create new user in mock API
    const newUser = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      favorites: []
    };
    
    const createResponse = await api.post('/auth', newUser);
    
    return {
      id: createResponse.data.id,
      name: createResponse.data.name,
      email: createResponse.data.email,
      token: 'mock-token-for-user-' + createResponse.data.id
    };
  } catch (error) {
    throw error;
  }
};