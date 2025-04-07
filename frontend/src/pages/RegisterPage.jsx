import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerSuccess, registerFailure } from '../redux/authSlice';
import { TextField, Button, Typography, Container, Card, CardContent, Link, CircularProgress, Alert } from '@mui/material';
import api from '../services/api';

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    try {
      // Mock API call - in a real app, this would be a real API call
      const response = await api.post('/auth', data);
      
      // For MockAPI.io, we'll simulate a response
      const mockResponse = {
        data: {
          id: '1',
          name: data.name,
          email: data.email,
          token: 'mock-token',
        }
      };
      
      localStorage.setItem('token', mockResponse.data.token);
      dispatch(registerSuccess(mockResponse.data));
      navigate('/');
    } catch (err) {
      dispatch(registerFailure('Registration failed. Please try again.'));
    }
  };

  return (
    <Container maxWidth="sm" className="py-8">
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Register
          </Typography>
          
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              margin="normal"
              {...register('name', { required: 'Name is required' })}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
            
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
            
            <TextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              margin="normal"
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => 
                  value === watch('password') || 'Passwords do not match'
              })}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
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
              {status === 'loading' ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </form>
          
          <Typography variant="body2" align="center" className="mt-4">
            Already have an account?{' '}
            <Link href="/login" underline="hover">
              Login here
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RegisterPage;