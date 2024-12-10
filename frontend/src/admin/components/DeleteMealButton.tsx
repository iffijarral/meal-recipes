import React from "react";
import { Button, useToast } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { DELETE_MEAL } from "../../graphql/mutations.js";
import { IMeal } from "../../interfaces/interfaces.js";
import { GET_MEALS_BY_CATEGORY_USER } from "../../graphql/queries.js";
import { useNavigate } from "react-router-dom";

interface Props {
    mealId: string;
    selectedCategory: string;
    userId: string
}
const DeleteMealButton = ({ mealId, selectedCategory, userId }: Props) => {
    const navigate = useNavigate();

    const toast = useToast();

    // Define the delete mutation
    const [deleteMeal, { loading, error }] = useMutation(DELETE_MEAL, {
        variables: { id: mealId },
        refetchQueries: [
            {
              query: GET_MEALS_BY_CATEGORY_USER,
              variables: {
                category: selectedCategory || "", // Provide the category
                userId: userId || "", // Provide the user ID
              },
            },
          ],
        onCompleted: (data) => {
            if (data?.deleteMeal?.success) {
                toast({
                    title: "Meal Deleted",
                    description: "The meal was successfully deleted.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    onCloseComplete: () => {
                        navigate('/dashboard/meals'); // Redirect to meals page
                    },
                });
            }
        },        
        onError: (err) => {
            toast({
                title: "Error",
                description: err.message || "There was an issue deleting the meal.",
                status: "error",
                duration: 5000,
                isClosable: true,                
            });
        },
        update: (cache, { data }) => {
            if (data?.deleteMeal?.success) {
                const deletedMealId = data.deleteMeal.mealId;
                cache.modify({
                    fields: {
                        meals(existingMeals = []) {
                            return existingMeals.filter((meal: IMeal) => meal.id !== deletedMealId);
                        },
                    },
                });
            }
        },
    });

    // Handle the delete operation
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this meal?")) {
            deleteMeal();
        }
    };

    return (
        <Button
            size="sm"
            mt={2}
            colorScheme="red"
            onClick={handleDelete}
            isLoading={loading}
            isDisabled={loading}
        >
            Delete
        </Button>
    );
};

export default DeleteMealButton;
