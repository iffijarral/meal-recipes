import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ICategory, IArea, IUser } from '../interfaces/interfaces.js';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_USER_BY_ID, GET_USER_INFO } from '../graphql/queries.js';
import { LOGOUT_MUTATION } from '../graphql/mutations.js';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: IUser | null;
  userContext: (user: IUser | null) => void;
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
  const [logoutMutation, { data: dataMutation, loading: loadingMutation, error: errorMutation }] = useMutation(LOGOUT_MUTATION);

  const [userInfo, { data, error }] = useLazyQuery(GET_USER_INFO);

  const navigate = useNavigate();

  useEffect(() => {    
    userInfo().then(({ data }) => {
      
      if (data?.userInfo) {        
        setUser(data.userInfo);
      }
    }).catch((error) => {
      console.error("Failed to fetch user:", error);
      setUser(null); // Clear user on error
    }).finally(() => setLoading(false));
  }, [userInfo]);

  const userContext = (user: IUser | null) => {
    setUser(user);
  };

  const logout = async () => {
    try {
      logoutMutation().then((response) => {
        console.log('Logout response:', response);
        setUser(null);
        navigate('/');
      }).catch((err) => {
        console.error('Logout error:', err || errorMutation);
      }).finally(() => {
        console.log('Logout');
      });
    } catch (err) {
      console.error('Logout error:', err);
    }

  };

  return (
    <AuthContext.Provider value={{ user, loading, userContext, logout, selectedCategory, setSelectedCategory, selectedArea, setSelectedArea }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;