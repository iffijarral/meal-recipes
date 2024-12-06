import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext.js';
import { Spinner } from '@chakra-ui/react';

const PrivateRoute: React.FC = () => {
  const { user, loading } = useContext(AuthContext)!;

  if (loading) {
    return <Spinner size="lg" />;
  }
  // If the user is authenticated, render the nested routes
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
