import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../redux/authSlice';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return children;
};

export default AuthInitializer;