import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Rating, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder, AccessTime } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../redux/favoriteSlice';

const RecipeCard = ({ recipe }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);
  
  const isFavorite = favorites.includes(recipe.id);

  const handleFavoriteClick = () => {
    if (!isAuthenticated || !user) return;
    
    if (isFavorite) {
      dispatch(removeFavorite({ userId: user.id, recipeId: recipe.id }));
    } else {
      dispatch(addFavorite({ userId: user.id, recipeId: recipe.id }));
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardMedia
        component="img"
        height="140"
        image={recipe.image || 'https://via.placeholder.com/300x200'}
        alt={recipe.title}
      />
      <CardContent className="flex-grow">
        <Typography gutterBottom variant="h5" component="div">
          {recipe.title}
        </Typography>
        <div className="flex items-center mb-2">
          <AccessTime className="mr-1" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {recipe.cookingTime} mins
          </Typography>
        </div>
        <Rating value={recipe.rating || 0} precision={0.5} readOnly />
      </CardContent>
      <CardActions className="justify-between">
        <Button size="small" component={Link} to={`/recipes/${recipe.id}`}>
          View Recipe
        </Button>
        <IconButton
          aria-label="add to favorites"
          onClick={handleFavoriteClick}
          color={isFavorite ? 'error' : 'default'}
          disabled={!isAuthenticated}
        >
          {isFavorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;