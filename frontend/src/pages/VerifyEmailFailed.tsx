import React from 'react';
import { Box, Button, Heading, VStack, Text, useColorModeValue } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const VerifyEmailFailed = () => {
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
          <WarningIcon w={10} h={10} color="red.400" />
          <Heading size="lg" color={useColorModeValue('red.600', 'red.400')}>
            Verification Failed
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            We couldn't verify your email. The link might be invalid or expired.
          </Text>
          <Button
            colorScheme="blue"
            w="full"
            onClick={() => navigate('/resend-verification')}
          >
            Resend Verification Email
          </Button>
          <Button
            variant="outline"
            colorScheme="blue"
            w="full"
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default VerifyEmailFailed;
