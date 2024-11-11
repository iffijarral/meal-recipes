import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  HStack
} from "@chakra-ui/react";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Box
        maxW="sm"
        w="full"
        p={6}
        borderRadius="md"
        boxShadow="lg"
        bg={useColorModeValue("white", "gray.700")}
      >
        <VStack spacing={6} as="form" onSubmit={handleSubmit}>
          <Heading size="lg">Sign in to your account</Heading>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input type="email" placeholder="Enter your email" />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" placeholder="Enter your password" />
          </FormControl>
          <Button
            colorScheme="blue"
            type="submit"
            w="full"
          >
            Sign In
          </Button>

          <Box width="100%" textAlign="left">
            <Button variant="link" colorScheme="blue" onClick={() => navigate("/signup")}>
              Forgot Password
            </Button>
          </Box>
          <Text fontSize="sm" color="gray.500">
            Don't have an account?
            <Button paddingLeft="2" variant="link" colorScheme="blue"
              onClick={() => navigate("/signup")}
            >Sign Up</Button>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
