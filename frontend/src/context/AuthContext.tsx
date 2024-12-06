import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ICategory, IArea, IUser } from '../interfaces/interfaces.js';
import { useLazyQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../graphql/queries.js';

interface AuthContextType {
  user: IUser | null;
  loginContext: (token: string, user: IUser) => void;
  logout: () => void;
  selectedCategory: ICategory | null;
  setSelectedCategory: (category: ICategory | null) => void;
  selectedArea: IArea | null;
  setSelectedArea: (category: IArea | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [selectedArea, setSelectedArea] = useState<IArea | null>(null);
  const [loading, setLoading] = useState(true);

  const [fetchUserById, { data, error }] = useLazyQuery(GET_USER_BY_ID);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { userId }: { userId: string } = jwtDecode(token);

        // Fetch the user from GraphQL
        fetchUserById({ variables: { id: userId } })
          .then(() => {
            if (data) {
              console.log('user', data);
              setUser(data.user); // Update context with the fetched user
            }
            if (error) {
              console.error("Failed to fetch user:", error);
              localStorage.removeItem("token"); // Remove invalid token
            }
          })
          .finally(() => setLoading(false));                

      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token'); // Remove invalid token
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [fetchUserById, data, error]);

  const loginContext = (token: string, user: IUser) => {
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginContext, logout, selectedCategory, setSelectedCategory, selectedArea, setSelectedArea }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;