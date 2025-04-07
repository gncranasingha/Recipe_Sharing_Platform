import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { Search as SearchIcon, Favorite as FavoriteIcon } from '@mui/icons-material';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
    handleMenuClose();
  };

  return (
    <AppBar position="static" className="bg-green-600">
      <Toolbar className="flex justify-between">
        <Link to="/" className="flex items-center">
          <Typography variant="h6" className="font-bold text-white">
            RecipeShare
          </Typography>
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button color="inherit" startIcon={<FavoriteIcon />} onClick={() => navigate('/favorites')}>
                Favorites
              </Button>
              <Button color="inherit" onClick={() => navigate('/add-recipe')}>
                Add Recipe
              </Button>
              <IconButton onClick={handleMenuOpen} color="inherit">
                <Avatar className="w-8 h-8" src={user?.avatar}>
                  {user?.name?.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;