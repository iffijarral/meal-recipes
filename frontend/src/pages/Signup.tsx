import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ValidationErrorItem } from "joi";
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
  Spinner,
  FormErrorMessage
} from "@chakra-ui/react";
import { SIGNUP_MUTATION } from "../graphql/mutations.js";
import { IFormData } from "../interfaces/interfaces.js";
import { getErrorMessage, validate } from "../utils/validation.js";
import { userSchema } from "../schemas/userSchema.js";

const sanitizeInput = (value: string) => value.trim();
const sanitizeEmail = (value: string) => value.trim().toLowerCase();
const sanitizePassword = (value: string) => value;



const Signup = () => {
  const [formData, setFormData] = useState<IFormData>({name: '', email: '', password: ''});
  const [errors, setErrors] = useState<ValidationErrorItem[]>([]);
  const [signup, {data, loading, error}] = useMutation(SIGNUP_MUTATION);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => prevErrors.filter((err) => err.path[0] !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    const { valid, errors: validationErrors } = validate(userSchema, formData);

    if (!valid) {
      console.log(validationErrors);
      setErrors(validationErrors || []);
      return;
    }

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
          <FormControl id="name" isInvalid={!!getErrorMessage(errors, 'name')}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" placeholder="Your name" onChange={handleChange} />
            <FormErrorMessage>{getErrorMessage(errors, 'name')}</FormErrorMessage>
          </FormControl>
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
          <FormControl id="confirmPassword" isInvalid={!!getErrorMessage(errors, 'confirmPassword')}>
            <FormLabel>ConfirmPassword</FormLabel>
            <Input type="password" name="confirmPassword" placeholder="Retype your password" onChange={handleChange} />
            <FormErrorMessage>{getErrorMessage(errors, 'confirmPassword')}</FormErrorMessage>
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
          <AlertDescription>Welcome, {data.signup.username}</AlertDescription>
        </Alert>
      )}
        </VStack>
      </Box>
    </Box>
  );
};

export default Signup;
