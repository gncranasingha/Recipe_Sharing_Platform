import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipeById, deleteRecipe, clearCurrentRecipe } from '../redux/recipeSlice';
import { addFavorite, removeFavorite } from '../redux/favoriteSlice';
import { Button, Typography, Card, CardMedia, CardContent, Grid, Divider, List, ListItem, ListItemText, IconButton, CircularProgress, Alert, Box, Container, Rating } from '@mui/material';
import { Favorite, FavoriteBorder, Edit, Delete, ArrowBack } from '@mui/icons-material';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRecipe, status, error } = useSelector((state) => state.recipes);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);
  
  const isFavorite = favorites.some((fav) => fav.recipeId === id);
  const isOwner = currentRecipe && user && currentRecipe.userId === user.id;

  useEffect(() => {
    dispatch(fetchRecipeById(id));
    
    return () => {
      dispatch(clearCurrentRecipe());
    };
  }, [dispatch, id]);

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isFavorite) {
      dispatch(removeFavorite({ userId: user.id, recipeId: id }));
    } else {
      dispatch(addFavorite({ userId: user.id, recipeId: id }));
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      dispatch(deleteRecipe(id)).then(() => {
        navigate('/');
      });
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center my-8">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="my-4">
        {error}
      </Alert>
    );
  }

  if (!currentRecipe) {
    return (
      <Typography variant="body1" className="text-center my-8">
        Recipe not found.
      </Typography>
    );
  }

  return (
    <Container className="py-8">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Back
      </Button>
      
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={currentRecipe.image || 'https://via.placeholder.com/800x400'}
          alt={currentRecipe.title}
        />
        
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1" gutterBottom>
              {currentRecipe.title}
            </Typography>
            
            <IconButton
              aria-label="add to favorites"
              onClick={handleFavoriteClick}
              color={isFavorite ? 'error' : 'default'}
              size="large"
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Box>
          
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="body1" color="text.secondary" className="mr-4">
              Cooking Time: {currentRecipe.cookingTime} mins
            </Typography>
            <Rating value={currentRecipe.rating || 0} precision={0.5} readOnly />
          </Box>
          
          {isOwner && (
            <Box mb={2}>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => navigate(`/recipes/${id}/edit`)}
                className="mr-2"
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          )}
          
          <Divider className="my-4" />
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h2" gutterBottom>
                Ingredients
              </Typography>
              <List>
                {currentRecipe.ingredients?.map((ingredient, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={ingredient} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h2" gutterBottom>
                Instructions
              </Typography>
              <List>
                {currentRecipe.instructions?.map((step, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Step ${index + 1}`}
                      secondary={step}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecipeDetailPage;

