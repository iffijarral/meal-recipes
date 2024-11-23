import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
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
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner
} from "@chakra-ui/react";
import { FormData } from "../interfaces/FormData";
import { LOGIN_MUTATION } from "../graphql/mutations";
import { useMutation } from "@apollo/client";
import { validate } from "../utils/validation";
import { loginSchema } from "../schemas/loginSchema";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<any>({});
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  const { loginContext } = useContext(AuthContext)!;

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here

    const { valid, errors } = validate(loginSchema, formData);
    if (!valid) {
      setErrors(errors);
      return;
    }

    try {
      const { data } = await login({ variables: formData });
      loginContext(data.login.token);
      navigate('/dashboard');
      console.log('Login result:', data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Signup error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
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
            <Input type="email" name="email" placeholder="Your email" onChange={handleChange} />
            {errors.email && <span>{errors.email.message}</span>}
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" name="password" placeholder="Your password" onChange={handleChange} />
            {errors.password && <span>{errors.password.message}</span>}
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
          {/* Loading Indicator */}
          {loading && (
            <Spinner size="xl" color="blue.500" />
          )}
          {/* Error Message */}
          {error && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              <AlertTitle>Error:</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {data && (
            <Alert status="success" mt={4}>
              <AlertIcon />
              <AlertTitle>Signup successful!</AlertTitle>
              <AlertDescription>Welcome, {data.signup.username}</AlertDescription>
            </Alert>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
