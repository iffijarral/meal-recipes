import React from 'react';
import { Box, Button, Heading, VStack, Text, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const VerifyEmailSuccess = () => {
  const navigate = useNavigate();

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Box
        maxW="sm"
        w="full"
        p={6}
        borderRadius="md"
        boxShadow="lg"
        bg={useColorModeValue('white', 'gray.700')}
      >
        <VStack spacing={6} textAlign="center">
          <Heading size="lg" color={useColorModeValue('blue.600', 'blue.400')}>
            Email Verified!
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            Your email has been successfully verified. You can now log in to your account.
          </Text>
          <Button
            colorScheme="blue"
            w="full"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default VerifyEmailSuccess;
