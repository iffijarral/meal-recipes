import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.js';

interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { user } = useContext(AuthContext)!;

  // If the user is already authenticated, redirect to the dashboard
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

export default AuthRedirect;
