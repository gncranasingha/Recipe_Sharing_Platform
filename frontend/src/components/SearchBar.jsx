import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchRecipes } from '../redux/recipeSlice';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchRecipes(searchTerm));
  };

  const handleClear = () => {
    setSearchTerm('');
    dispatch(fetchRecipes());
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md mx-auto my-4">
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search recipes by title or ingredient..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear}>
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
};

export default SearchBar;