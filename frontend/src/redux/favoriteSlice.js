import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/auth/${userId}`);
      return response.data.favorites || []; // Return favorites array 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async ({ userId, recipeId }, { rejectWithValue }) => {
    try {
     
      const { data: user } = await api.get(`/auth/${userId}`);
      
       const currentFavorites = user.favorites || [];
      
      // Check if already favorited
      if (currentFavorites.includes(recipeId)) {
        return currentFavorites;
      }
      
      // Add the new favorite
      const updatedFavorites = [...currentFavorites, recipeId];
      
      
      const response = await api.put(`/auth/${userId}`, {
        ...user,
        favorites: updatedFavorites
      });
      
      return updatedFavorites;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async ({ userId, recipeId }, { rejectWithValue }) => {
    try {
    
      const { data: user } = await api.get(`/auth/${userId}`);
      
      const currentFavorites = user.favorites || [];
      
       const updatedFavorites = currentFavorites.filter(id => id !== recipeId);
      
    
      const response = await api.put(`/auth/${userId}`, {
        ...user,
        favorites: updatedFavorites
      });
      
      return updatedFavorites;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorites: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  },
});

export default favoriteSlice.reducer;