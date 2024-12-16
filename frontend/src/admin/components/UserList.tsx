import React, { useState, useEffect } from "react";

import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Heading,
    IconButton,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS } from "../../graphql/queries.js";
import { DELETE_USER } from "../../graphql/mutations.js";
import { IUser } from "../../interfaces/interfaces.js";
import { useNavigate } from "react-router-dom";



const UserList = () => {

    const { loading, error, data, refetch } = useQuery(GET_USERS);

    const [deleteUser, { data: deleteData, loading: leleteLoading, error: deleteError }] = useMutation(DELETE_USER);

    const [users, setUsers] = useState<IUser[]>([]);

    const bg = useColorModeValue("white", "gray.700"); // Moved outside of render loop 

    const navigate = useNavigate();

    useEffect(() => {

        if (data) {
            setUsers(data.users || []);
        }

    }, [data]);



    const handleDelete = async (userId: string) => {
        const confirmation = window.confirm("Are you sure you want to delete this user?");
        if (!confirmation) return;
    
        try {
            await deleteUser({ variables: { id: userId } });
            refetch(); // Refresh the list after deletion
        } catch (err) {
            console.error("Error deleting user:", err);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
        );
    }
    return (
        <Box p={6} minH="100vh">
            <Heading size="lg" mb={6}>
                User List
            </Heading>
            <VStack spacing={4} align="stretch">
                {users.length === 0 ? (
                    <Box
                        p={4}
                        borderWidth={1}
                        borderRadius="md"
                        bg={bg} // Using pre-defined value
                        boxShadow="sm"
                        textAlign="center"
                    >
                        <Text fontSize="lg" fontWeight="bold" color="gray.500">
                            No user found
                        </Text>
                    </Box>
                ) : (
                    users.map((user) => (
                        <Box
                            key={user.id}
                            p={4}
                            borderWidth={1}
                            borderRadius="md"
                            bg={bg} // Using pre-defined value
                            boxShadow="sm"
                        >
                            <HStack justifyContent="space-between">
                                <VStack align="start" spacing={0}>
                                    <Text fontSize="lg" fontWeight="bold">
                                        {user.name}
                                    </Text>
                                    <Text fontSize="sm">{user.email}</Text>
                                </VStack>
                                <HStack>
                                    <Button
                                        size="sm"
                                        colorScheme="blue"
                                        leftIcon={<EditIcon />}
                                        onClick={() => navigate(`/dashboard/edit-user/${user.id}`)}
                                    >
                                        Update
                                    </Button>
                                    <IconButton
                                        size="sm"
                                        colorScheme="red"
                                        icon={<DeleteIcon />}
                                        onClick={() => handleDelete(user.id)}
                                        aria-label="Delete User"
                                    />
                                </HStack>
                            </HStack>
                        </Box>
                    ))
                )}
            </VStack>

        </Box>
    );
};

export default UserList;

