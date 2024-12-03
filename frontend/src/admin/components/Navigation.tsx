import React from 'react';
import { Box, Flex, Link, Button, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Navigation = () => {
   
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
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navigation;