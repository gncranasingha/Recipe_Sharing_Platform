import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/recipes');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchRecipeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addRecipe = createAsyncThunk(
  'recipes/addRecipe',
  async (recipeData, { rejectWithValue }) => {
    try {
      const response = await api.post('/recipes', recipeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateRecipe = createAsyncThunk(
  'recipes/updateRecipe',
  async ({ id, recipeData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/recipes/${id}`, recipeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  'recipes/deleteRecipe',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/recipes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: [],
    currentRecipe: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentRecipe(state) {
      state.currentRecipe = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchRecipeById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.recipes.push(action.payload);
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const index = state.recipes.findIndex(
          (recipe) => recipe.id === action.payload.id
        );
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.recipes = state.recipes.filter(
          (recipe) => recipe.id !== action.payload
        );
      });
  },
});

export const { clearCurrentRecipe } = recipeSlice.actions;

export default recipeSlice.reducer;

