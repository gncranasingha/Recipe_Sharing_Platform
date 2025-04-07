import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes } from '../redux/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import { Grid, Container, Typography, CircularProgress, Alert } from '@mui/material';

const HomePage = () => {
  const dispatch = useDispatch();
  const { recipes, status, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  return (
    <Container className="py-8" >
      <Typography variant="h4" component="h1" gutterBottom className="text-center">
        Discover Recipes
      </Typography>
      
      <SearchBar />
      
      {status === 'loading' ? (
        <div className="flex justify-center my-8">
          <CircularProgress />
        </div>
      ) : error ? (
        <Alert severity="error" className="my-4">
          {error}
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {recipes.map((recipe) => (
            <Grid item key={recipe.id} xs={12} sm={6} md={4} lg={3}>
              <RecipeCard recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      )}
      
      {status === 'succeeded' && recipes.length === 0 && (
        <Typography variant="body1" className="text-center my-8">
          No recipes found. Be the first to add one!
        </Typography>
      )}
    </Container>
  );
};

export default HomePage;