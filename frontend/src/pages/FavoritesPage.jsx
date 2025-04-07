import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../redux/favoriteSlice';
import { fetchRecipes } from '../redux/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import {
  Grid,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { favorites, status: favoritesStatus, error: favoritesError } = useSelector((state) => state.favorites);
  const { recipes, status: recipesStatus } = useSelector((state) => state.recipes);

  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites(user.id));
    }
    dispatch(fetchRecipes());
  }, [dispatch, user]);

  const favoriteRecipes = recipes.filter(recipe => 
    favorites.includes(recipe.id)
  );

  if (!user) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5" textAlign="center">
          Please login to view your favorites
        </Typography>
      </Container>
    );
  }

  if (favoritesStatus === 'loading' || recipesStatus === 'loading') {
    return (
      <Box display="flex" justifyContent="center" my={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (favoritesError) {
    return (
      <Alert severity="error" sx={{ my: 4 }}>
        {favoritesError}
      </Alert>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Your Favorite Recipes
      </Typography>
      
      {favoriteRecipes.length === 0 ? (
        <Typography variant="body1" textAlign="center" my={8}>
          You haven't saved any recipes yet.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {favoriteRecipes.map((recipe) => (
            <Grid item key={recipe.id} xs={12} sm={6} md={4} lg={3}>
              <RecipeCard recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FavoritesPage;