import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addRecipe, updateRecipe, fetchRecipeById, clearCurrentRecipe } from '../redux/recipeSlice';
import { TextField, Button, Typography, Container, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';

const AddEditRecipePage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentRecipe, status, error } = useSelector((state) => state.recipes);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    setValue
  } = useForm({
    defaultValues: {
      title: '',
      cookingTime: '',
      ingredients: '',
      instructions: '',
      image: '',
      userId: '' 
    }
  });

  // Check authentication and fetch recipe if in edit mode
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  
    if (isEditMode) {
      dispatch(fetchRecipeById(id))
        .unwrap()
        .then((recipe) => {
          if (!recipe || recipe.userId !== user?.id) {
            navigate('/');
            return;
          }
          reset({
            title: recipe.title,
            cookingTime: recipe.cookingTime,
            ingredients: recipe.ingredients?.join('\n') || '',
            instructions: recipe.instructions?.join('\n') || '',
            image: recipe.image || '',
            userId: recipe.userId
          });
        })
        .catch((error) => {
          console.error('Failed to fetch recipe:', error);
          navigate('/');
        });
    } else {
      
      reset({
        title: '',
        cookingTime: '',
        ingredients: '',
        instructions: '',
        image: '',
        userId: user?.id || ''
      });
    }
  }, [dispatch, id, isEditMode, isAuthenticated, navigate, reset, user]);
  // Set form values when currentRecipe
  useEffect(() => {
    if (isEditMode && currentRecipe) {
      if (currentRecipe.userId !== user?.id) {
        navigate('/');
        return;
      }

    
      reset({
        title: currentRecipe.title,
        cookingTime: currentRecipe.cookingTime,
        ingredients: currentRecipe.ingredients?.join('\n') || '',
        instructions: currentRecipe.instructions?.join('\n') || '',
        image: currentRecipe.image || '',
        userId: currentRecipe.userId
      });
    } else if (!isEditMode) {
    
      reset({
        title: '',
        cookingTime: '',
        ingredients: '',
        instructions: '',
        image: '',
        userId: user?.id || '' 
      });
    }
  }, [currentRecipe, isEditMode, reset, user, navigate]);

  const onSubmit = (data) => {
    //  ingredients and instructions as arrays
    const recipeData = {
      title: data.title,
      cookingTime: parseInt(data.cookingTime, 10),
      ingredients: data.ingredients.split('\n').filter(line => line.trim()),
      instructions: data.instructions.split('\n').filter(line => line.trim()),
      image: data.image,
      userId: user.id
    };

    if (isEditMode) {
      dispatch(updateRecipe({ id, recipeData }))
        .unwrap()
        .then(() => {
          navigate(`/recipes/${id}`);
        })
        .catch((error) => {
          console.error('Failed to update recipe:', error);
        });
    } else {
      dispatch(addRecipe(recipeData))
        .unwrap()
        .then((newRecipe) => {
          navigate(`/recipes/${newRecipe.id}`);
        })
        .catch((error) => {
          console.error('Failed to add recipe:', error);
        });
    }
  };

  if (status === 'loading') {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(isEditMode ? `/recipes/${id}` : '/')}
        sx={{ mb: 3 }}
      >
        Back
      </Button>
      
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? 'Edit Recipe' : 'Add New Recipe'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Recipe Title"
                  variant="outlined"
                  {...register('title', { 
                    required: 'Title is required',
                    minLength: {
                      value: 3,
                      message: 'Title must be at least 3 characters'
                    }
                  })}
                  error={Boolean(errors.title)}
                  helperText={errors.title?.message}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cooking Time (minutes)"
                  variant="outlined"
                  type="number"
                  inputProps={{ min: 1 }}
                  {...register('cookingTime', { 
                    required: 'Cooking time is required',
                    min: { 
                      value: 1, 
                      message: 'Cooking time must be at least 1 minute' 
                    },
                    max: {
                      value: 1000,
                      message: 'Cooking time must be less than 1000 minutes'
                    }
                  })}
                  error={Boolean(errors.cookingTime)}
                  helperText={errors.cookingTime?.message}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Image URL"
                  variant="outlined"
                  {...register('image', {
                    pattern: {
                      value: /^(https?:\/\/).+\.(jpg|jpeg|png|gif|bmp|webp)$/i,
                      message: 'Please enter a valid image URL'
                    }
                  })}
                  placeholder="https://example.com/image.jpg"
                  error={Boolean(errors.image)}
                  helperText={errors.image?.message}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ingredients (one per line)"
                  variant="outlined"
                  multiline
                  rows={4}
                  {...register('ingredients', { 
                    required: 'At least one ingredient is required',
                    validate: value => {
                      const lines = value.split('\n').filter(line => line.trim());
                      return lines.length > 0 || 'Enter at least one ingredient';
                    }
                  })}
                  error={Boolean(errors.ingredients)}
                  helperText={errors.ingredients?.message}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Instructions (one step per line)"
                  variant="outlined"
                  multiline
                  rows={6}
                  {...register('instructions', { 
                    required: 'At least one instruction is required',
                    validate: value => {
                      const lines = value.split('\n').filter(line => line.trim());
                      return lines.length > 0 || 'Enter at least one instruction';
                    }
                  })}
                  error={Boolean(errors.instructions)}
                  helperText={errors.instructions?.message}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<Save />}
                  disabled={status === 'loading'}
                  sx={{ mt: 2 }}
                >
                  {status === 'loading' ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : isEditMode ? (
                    'Update Recipe'
                  ) : (
                    'Save Recipe'
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddEditRecipePage;

