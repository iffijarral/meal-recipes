import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ValidationErrorItem } from "joi";
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
  Spinner,
  FormErrorMessage
} from "@chakra-ui/react";
import { IFormData } from "../interfaces/interfaces.js";
import { LOGIN_MUTATION } from "../graphql/mutations.js";
import { useMutation } from "@apollo/client";
import { validate } from "../utils/validation.js";
import { loginSchema } from "../schemas/loginSchema.js";
import AuthContext from "../context/AuthContext.js";
import { getErrorMessage } from "../utils/validation.js";

const Login = () => {
  const [formData, setFormData] = useState<IFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<ValidationErrorItem[]>([]);
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION, {
    fetchPolicy: "no-cache"
  });

  const { loginContext } = useContext(AuthContext)!;

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => prevErrors.filter((err) => err.path[0] !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here

    const { valid, errors: validationErrors } = validate(loginSchema, formData);
    
    if (!valid) {
      console.log(validationErrors);
      setErrors(validationErrors || []);
      return;
    }

    try {
      console.log('before login request');
      const { data } = await login({ variables: {input: formData } });
      console.log('data in login page', data);
      loginContext(data.login.token, data.login.user);
      navigate('/dashboard');
      console.log('Login result:', data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Login error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
    setErrors([]);
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
        maxW="md"
        w="full"
        p={6}
        borderRadius="md"
        boxShadow="lg"
        bg={useColorModeValue("white", "gray.700")}
      >
        <VStack spacing={6} as="form" noValidate onSubmit={handleSubmit}>
          <Heading size="lg">Sign in to your account</Heading>
          <FormControl id="email" isInvalid={!!getErrorMessage(errors, 'email')}>
            <FormLabel>Email address</FormLabel>
            <Input type="text" name="email" placeholder="Your email" onChange={handleChange} />
            <FormErrorMessage>{getErrorMessage(errors, 'email')}</FormErrorMessage>
          </FormControl>
          <FormControl id="password" isInvalid={!!getErrorMessage(errors, 'password')}>
            <FormLabel>Password</FormLabel>
            <Input type="password" name="password" placeholder="Your password" onChange={handleChange} />
            <FormErrorMessage>{getErrorMessage(errors, 'password')}</FormErrorMessage>
          </FormControl>
          <Button
            colorScheme="blue"
            type="submit"
            w="full"
          >
            Sign In
          </Button>

          <Box width="100%" textAlign="left">
            <Button variant="link" colorScheme="blue" onClick={() => navigate("/forgot-password")}>
              Forgot Password
            </Button>
          </Box>
          <Text fontSize="sm" color="gray.500">
            Don't have an account?
            <Button paddingLeft="2" variant="link" colorScheme="blue"
              onClick={() => navigate("/signup")}
            >Sign Up</Button>
          </Text>
          <Box width="100%" textAlign="center" mt={4}>
            <Button variant="outline" colorScheme="blue" onClick={() => navigate("/")}>
              Go to Home
            </Button>
          </Box>
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
              <AlertDescription>Welcome, {data.signup.username}, Please login to proceed.</AlertDescription>
            </Alert>
          )}
        </VStack>
      </Box >
    </Box >
  );
};

export default Login;
