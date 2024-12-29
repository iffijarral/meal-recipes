import { useMutation } from '@apollo/client';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGOUT_MUTATION } from '../graphql/mutations.js';
import AuthContext from '../context/AuthContext.js';
import { Text } from '@chakra-ui/react';

const Logout: React.FC = () => {

  const { userContext } = useContext(AuthContext)!;

  const navigate = useNavigate();

  const [logout, { data, loading, error }] = useMutation(LOGOUT_MUTATION);

  const handleLogout = async () => {
    alert('logout clicked');
    // await logout().then(() => {
    //   userContext(null);
    // }).catch((err) => {
    //   console.error('Logout error:', err);
    // }).finally(() => {
    //   navigate('/login');
    // });    
  };

  return (
    <> <Text onClick={handleLogout}> Logout </Text></>
  );
};

export default Logout;