import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Switch,
    VStack,
    useColorModeValue,
    Spinner,
    Flex,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    FormErrorMessage,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "../../graphql/mutations.js";
import { GET_USER_BY_ID } from "../../graphql/queries.js";
import { useParams } from "react-router-dom";
import { IUserUpdateFormData } from "../../interfaces/interfaces.js";
import { getErrorMessage, validate } from "../../utils/validation.js";
import { userUpdateSchema } from "../../schemas/userUpdateSchema.js";
import { ValidationErrorItem } from "joi";

const UpdateUser = () => {
    const { userId } = useParams<{ userId: string }>();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [errors, setErrors] = useState<ValidationErrorItem[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);

    const { data, loading: userLoading, error: userError } = useQuery(GET_USER_BY_ID, {
        variables: { id: userId },
        skip: !userId,
    });

    const [updateUser] = useMutation(UPDATE_USER_MUTATION);

    useEffect(() => {
        if (data?.user) {
            setName(data.user.name || "");
            setEmail(data.user.email || "");
            setIsActive(data.user.isActive || false);
        }
    }, [data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare the form data for validation
        const formData: IUserUpdateFormData = {
            name,
            email,
            isActive,
        };

        // Validate the form data
        const { valid, errors: validationErrors = [] } = validate(userUpdateSchema, formData);
        if (!valid) {
            console.log(validationErrors);
            setErrors(validationErrors || []);
            return;
        }

        // Clear previous error state
        setErrors([]);
        setErrorMessage(null);

        try {
            const response = await updateUser({
                variables: { id: userId, input: formData },
            });
            console.log("User updated successfully:", response);
            if (response.data.updateUser.id) {
                setIsUpdated(true);
            }
        } catch (error) {
            console.error("Error submitting user data:", error);
            setErrorMessage("Failed to submit user data.");
        }
    };

    if (userLoading) {
        return (
            <Flex
                height="100vh"
                alignItems="center"
                justifyContent="center"
            >
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    if (userError) {
        return (
            <Flex
                height="100vh"
                alignItems="center"
                justifyContent="center"
                bg={useColorModeValue("gray.50", "gray.800")}
            >
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>Error fetching user data</AlertTitle>
                    <AlertDescription>{userError.message}</AlertDescription>
                </Alert>
            </Flex>
        );
    }

    return (
        <Flex height="100%" justifyContent="center">
            <Box
                maxW="lg"
                w="full"
                p={6}
                borderRadius="md"
                boxShadow="lg"
            >
                <VStack spacing={6} as="form" noValidate onSubmit={handleSubmit}>
                    <Heading size="lg">Update User Information</Heading>

                    {/* Name Input */}
                    <FormControl id="name" isInvalid={!!getErrorMessage(errors, 'name')}>
                        <FormLabel>Name</FormLabel>
                        <Input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <FormErrorMessage>{getErrorMessage(errors, 'name')}</FormErrorMessage>
                    </FormControl>
                    {/* Email Input */}
                    <FormControl id="email" isInvalid={!!getErrorMessage(errors, 'email')}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="text"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FormErrorMessage>{getErrorMessage(errors, 'email')}</FormErrorMessage>
                    </FormControl>

                    {/* Is Active Switch */}
                    <FormControl display="flex" alignItems="center" id="isActive">
                        <FormLabel htmlFor="isActive" mb="0">
                            Is Active
                        </FormLabel>
                        <Switch
                            id="isActive"
                            isChecked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                    </FormControl>

                    {/* Submit Button */}
                    <Button
                        colorScheme="blue"
                        type="submit"
                        w="full"
                    >
                        Update
                    </Button>
                    {/* Success Alerts */}
                    {isUpdated && (
                        <Alert status="success" mt={4}>
                            <AlertIcon />
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>User updated successfully</AlertDescription>
                        </Alert>
                    )}
                    {/* Error Alerts */}
                    {errorMessage && (
                        <Alert status="error" mt={4}>
                            <AlertIcon />
                            <AlertTitle>Error submitting data</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    {/* Validation Errors */}
                    {Object.keys(errors).length > 0 && (
                        <Box mt={4}>
                            {Object.entries(errors).map(([key, value]) => (
                                <Alert key={key} status="error">
                                    <AlertIcon />
                                    <AlertTitle>Validation Error</AlertTitle>
                                    <AlertDescription>
                                        {key}: {value.message}
                                    </AlertDescription>
                                </Alert>
                            ))}
                        </Box>
                    )}
                </VStack>
            </Box>
        </Flex>
    );
};

export default UpdateUser;
