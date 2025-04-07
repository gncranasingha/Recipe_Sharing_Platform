import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Divider,
  Avatar,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Favorite as FavoriteIcon,
  Add as AddIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  
  const desktopItems = (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Button 
        color="inherit" 
        component={Link} 
        to="/"
        startIcon={<HomeIcon />}
      >
        Home
      </Button>
      {isAuthenticated && (
        <>
          <Button 
            color="inherit" 
            component={Link} 
            to="/favorites"
            startIcon={<FavoriteIcon />}
          >
            Favorites
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/add-recipe"
            startIcon={<AddIcon />}
          >
            Add Recipe
          </Button>
          <Button 
            color="inherit" 
            onClick={handleLogout}
           
            sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
          >
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
              {user?.name?.charAt(0)}
            </Avatar>
            Logout
          </Button>
        </>
      )}
      {!isAuthenticated && (
        <>
          <Button 
            color="inherit" 
            component={Link} 
            to="/login"
            startIcon={<LoginIcon />}
          >
            Login
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/register"
            startIcon={<PersonAddIcon />}
          >
            Register
          </Button>
        </>
      )}
    </Box>
  );

  
  const mobileMenu = (
    <>
      <IconButton
        size="large"
        edge="end"
        color="inherit"
        aria-label="menu"
        onClick={handleMenuOpen}
        sx={{ ml: 2 }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={Link} to="/" onClick={handleMenuClose}>
          <ListItemIcon>
            <HomeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
        </MenuItem>
        
        {isAuthenticated ? (
          <>
            <MenuItem component={Link} to="/favorites" onClick={handleMenuClose}>
              <ListItemIcon>
                <FavoriteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Favorites</ListItemText>
            </MenuItem>
            <MenuItem component={Link} to="/add-recipe" onClick={handleMenuClose}>
              <ListItemIcon>
                <AddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Add Recipe</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                {user?.name?.charAt(0)}
              </Avatar>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
              <ListItemIcon>
                <LoginIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Login</ListItemText>
            </MenuItem>
            <MenuItem component={Link} to="/register" onClick={handleMenuClose}>
              <ListItemIcon>
                <PersonAddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Register</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/"
          sx={{ 
            flexGrow: 1, 
            fontWeight: 700,
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          Recipe App
        </Typography>
        
        {!isMobile ? desktopItems : mobileMenu}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;