import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
      
    
      const user = JSON.parse(userData);
      return user;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue('Session expired. Please login again.');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.status = 'loading';
    },
    loginSuccess(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
    },
    loginFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    logout(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.isAuthenticated = false;
    },
    registerStart(state) {
      state.status = 'loading';
    },
    registerSuccess(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
    },
    registerFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
        state.status = 'succeeded';
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
} = authSlice.actions;

export default authSlice.reducer;