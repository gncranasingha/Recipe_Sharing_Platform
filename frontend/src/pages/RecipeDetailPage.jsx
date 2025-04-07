import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipeById, deleteRecipe, clearCurrentRecipe } from '../redux/recipeSlice';
import { addFavorite, removeFavorite } from '../redux/favoriteSlice';
import {
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert,
  Box,
  Container,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Favorite, FavoriteBorder, Edit, Delete, ArrowBack } from '@mui/icons-material';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRecipe, status, error } = useSelector((state) => state.recipes);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);
  
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  
  const isFavorite = favorites.some((fav) => fav.recipeId === id);
  
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

  const handleEditClick = () => {
    navigate(`/recipes/${id}/edit`);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    setOpenDeleteDialog(false);
    dispatch(deleteRecipe(id))
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Failed to delete recipe:', error);
      });
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" my={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!currentRecipe) {
    return (
      <Typography variant="body1" textAlign="center" my={8}>
        Recipe not found.
      </Typography>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      {/* Delete  */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Recipe</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete "{currentRecipe.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 4 }}
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
            <Typography variant="body1" color="text.secondary" sx={{ mr: 4 }}>
              Cooking Time: {currentRecipe.cookingTime} mins
            </Typography>
            <Rating value={currentRecipe.rating || 0} precision={0.5} readOnly />
          </Box>
          
          {/* Edit/Delete Buttons */}
         
         
{isAuthenticated && (
  <Box mb={2}>
    <Button
      variant="contained"
      startIcon={<Edit />}
      onClick={handleEditClick}
      sx={{ mr: 2 }}
    >
      Edit Recipe
    </Button>
    <Button
      variant="outlined"
      color="error"
      startIcon={<Delete />}
      onClick={handleDeleteClick}
    >
      Delete Recipe
    </Button>
  </Box>
)}
          
          
          <Divider sx={{ my: 4 }} />
          
          
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

