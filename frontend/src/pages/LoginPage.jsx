import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure } from '../redux/authSlice';
import { TextField, Button, Typography, Container, Card, CardContent, Link, CircularProgress, Alert } from '@mui/material';
import api from '../services/api';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    try {
       const response = await api.post('/auth', data);
      
      const mockResponse = {
        data: {
          id: '1',
          name: data.email.split('@')[0],
          email: data.email,
          token: 'mock-token',
          favorites: []
        }
      };
      
      localStorage.setItem('token', mockResponse.data.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.data));
      dispatch(loginSuccess(mockResponse.data));
      navigate('/');
    } catch (err) {
      dispatch(loginFailure('Invalid email or password'));
    }
  };

  return (
    <Container maxWidth="sm" className="py-8">
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Login
          </Typography>
          
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              className="mt-4"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>
          
          <Typography variant="body2" align="center" className="mt-4">
            Don't have an account?{' '}
            <Link href="/register" underline="hover">
              Register here
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;