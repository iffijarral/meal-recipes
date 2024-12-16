import React, { useContext } from 'react';
import { Box, Flex, Link, Button, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.js';

const Navigation = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { user } = authContext;
  return (
    <Box px={4} pt={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex direction="column" alignItems="center">
          <Link as={RouterLink} to="/" px={2} py={1} rounded="md" _hover={{ textDecoration: 'none', bg: 'blue.700' }} color="white">
            Home
          </Link>
          <Link as={RouterLink} to="/dashboard/meals" px={2} py={1} rounded="md" _hover={{ textDecoration: 'none', bg: 'blue.700' }} color="white">
            Meals
          </Link>
          {
            user?.role === 'admin' &&
            <Link as={RouterLink} to="/dashboard/users" px={2} py={1} rounded="md" _hover={{ textDecoration: 'none', bg: 'blue.700' }} color="white">
              Users
            </Link>
          }
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navigation;