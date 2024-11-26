import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,  
  Text,
  useColorModeValue,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner
} from "@chakra-ui/react";
import { SIGNUP_MUTATION } from "../graphql/mutations.js";
import { useMutation } from "@apollo/client";
import { FormData } from "../interfaces/FormData.js";

const sanitizeInput = (value: string) => value.trim();
const sanitizeEmail = (value: string) => value.trim().toLowerCase();
const sanitizePassword = (value: string) => value;



const Signup = () => {
  const [formData, setFormData] = useState<FormData>({name: '', email: '', password: ''});
  const [signup, {data, loading, error}] = useMutation(SIGNUP_MUTATION);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    
    const sanitizedData = {
      name: sanitizeInput(formData.name || ""),
      email: sanitizeEmail(formData.email),
      password: sanitizePassword(formData.password),
      role: 'user',
      isActive: false,
      isVerified: false
    };    

    try {
      const result = signup({ variables: { input: sanitizedData } });
      console.log('Signup result:', result);
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
          <Heading size="lg">Create your account</Heading>
          <FormControl id="username" isRequired>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" placeholder="Your name" onChange={handleChange} />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input type="email" name="email" placeholder="Your email" onChange={handleChange} />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" name="password" placeholder="Your password" onChange={handleChange} />
          </FormControl>
          <Button colorScheme="blue" type="submit" w="full">
            Sign Up
          </Button>
          <Text fontSize="sm" color="gray.500">
            Already have an account? 
            <Button paddingLeft="2" variant="link" colorScheme="blue"
                onClick={ () => navigate('/login') }
            >Login</Button>
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

export default Signup;
