import { createSlice } from '@reduxjs/toolkit';

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

