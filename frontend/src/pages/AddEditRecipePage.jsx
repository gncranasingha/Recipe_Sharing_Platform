import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addRecipe, updateRecipe, fetchRecipeById } from '../redux/recipeSlice';
import { TextField, Button, Typography, Container, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';

const AddEditRecipePage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRecipe, status, error } = useSelector((state) => state.recipes);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      title: '',
      cookingTime: '',
      ingredients: '',
      instructions: '',
      image: '',
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    if (isEditMode) {
      dispatch(fetchRecipeById(id));
    }
    
    return () => {
      if (isEditMode) {
        dispatch(clearCurrentRecipe());
      }
    };
  }, [dispatch, id, isEditMode, isAuthenticated, navigate]);

  useEffect(() => {
    if (isEditMode && currentRecipe) {
      setValue('title', currentRecipe.title);
      setValue('cookingTime', currentRecipe.cookingTime);
      setValue('ingredients', currentRecipe.ingredients?.join('\n') || '');
      setValue('instructions', currentRecipe.instructions?.join('\n') || '');
      setValue('image', currentRecipe.image || '');
    }
  }, [currentRecipe, isEditMode, setValue]);

  const onSubmit = (data) => {
    const recipeData = {
      ...data,
      ingredients: data.ingredients.split('\n').filter(Boolean),
      instructions: data.instructions.split('\n').filter(Boolean),
      cookingTime: parseInt(data.cookingTime, 10),
    };
    
    if (isEditMode) {
      dispatch(updateRecipe({ id, recipeData })).then(() => {
        navigate(`/recipes/${id}`);
      });
    } else {
      dispatch(addRecipe(recipeData)).then((action) => {
        if (action.payload) {
          navigate(`/recipes/${action.payload.id}`);
        }
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

  return (
    <Container className="py-8">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(isEditMode ? `/recipes/${id}` : '/')}
        className="mb-4"
      >
        Back
      </Button>
      
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? 'Edit Recipe' : 'Add New Recipe'}
      </Typography>
      
      {error && (
        <Alert severity="error" className="mb-4">
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
                  {...register('title', { required: 'Title is required' })}
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
                  {...register('cookingTime', { 
                    required: 'Cooking time is required',
                    min: { value: 1, message: 'Cooking time must be at least 1 minute' }
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
                  {...register('image')}
                  placeholder="https://example.com/image.jpg"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ingredients (one per line)"
                  variant="outlined"
                  multiline
                  rows={4}
                  {...register('ingredients', { required: 'At least one ingredient is required' })}
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
                  {...register('instructions', { required: 'At least one instruction is required' })}
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
                >
                  {isEditMode ? 'Update Recipe' : 'Save Recipe'}
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