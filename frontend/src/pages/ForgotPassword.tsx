import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  FormErrorMessage,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { validate } from "../utils/validation.js";
import { forgotPasswordSchema } from "../schemas/forgotPasswordSchema.js";
import { FORGOT_PASSWORD_MUTATION } from "../graphql/mutations.js";
import { getErrorMessage } from "../utils/validation.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<string | null>(null);
  const [forgotPassword, { data, loading, error }] = useMutation(FORGOT_PASSWORD_MUTATION, {
    fetchPolicy: "no-cache",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { valid, errors: validationErrors } = validate(forgotPasswordSchema, { email });
    if (!valid) {
      setErrors(validationErrors?.[0]?.message || "Invalid input");
      return;
    }

    try {
      await forgotPassword({ variables: { email } });
    } catch (err) {
      console.error("Forgot password error:", err);
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
        <VStack spacing={6} as="form" noValidate onSubmit={handleSubmit}>
          <Heading size="lg">Forgot Password</Heading>
          <Text fontSize="sm" color="gray.500">
            Enter your email to receive password reset instructions.
          </Text>
          <FormControl id="email" isInvalid={!!errors}>
            <FormLabel>Email address</FormLabel>
            <Input type="email" name="email" placeholder="Your email" onChange={handleChange} />
            <FormErrorMessage>{errors}</FormErrorMessage>
          </FormControl>
          <Button colorScheme="blue" type="submit" w="full" isDisabled={loading}>
            Submit
          </Button>

          <Box width="100%" textAlign="center" mt={4}>
            <Button variant="outline" colorScheme="blue" onClick={() => navigate("/login")}>
              Back to Login
            </Button>
          </Box>

          {/* Loading Indicator */}
          {loading && <Spinner size="xl" color="blue.500" />}

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
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                If your email is registered, you will receive a password reset link shortly.
              </AlertDescription>
            </Alert>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
