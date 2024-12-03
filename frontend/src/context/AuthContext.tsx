import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ICategory, IArea, IUser } from '../interfaces/interfaces.js';

interface AuthContextType {
  user: IUser | null;
  loginContext: (token: string, user: IUser) => void;
  logout: () => void;
  selectedCategory: ICategory | null;
  setSelectedCategory: (category: ICategory | null) => void;
  selectedArea: IArea | null;
  setSelectedArea: (category: IArea | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [selectedArea, setSelectedArea] = useState<IArea | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: IUser = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token'); // Remove invalid token
      }
    }
  }, []);

  const loginContext = (token: string, user: IUser) => {
    localStorage.setItem('token', token);    
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginContext, logout, selectedCategory, setSelectedCategory, selectedArea, setSelectedArea }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;