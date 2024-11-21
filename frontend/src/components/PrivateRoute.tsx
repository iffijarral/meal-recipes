import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute: React.FC = () => {
  const { user } = useContext(AuthContext)!;

  // If the user is authenticated, render the nested routes
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
