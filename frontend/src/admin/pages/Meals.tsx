import React, { useState, useEffect } from "react";
import { Box, Spinner, useToast } from "@chakra-ui/react";
import MealForm from "../components/MealForm"; // Adjust the path as necessary
import { Category } from "../../interfaces/Category";
import { AvailableIngredient } from "../../interfaces/AvailableIngredient";
import { IMeal } from "../../interfaces/Meal";
import { GET_MEALS } from "../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_MEAL_MUTATION } from "../../graphql/mutations";
import { Ingredient } from "../../interfaces/Ingredient";

const Meals: React.FC = () => {
    const { loading, error, data } = useQuery(GET_MEALS);
    const [addMeal] = useMutation(ADD_MEAL_MUTATION);
    const toast = useToast();

    const handleMealSubmit = async (meal: IMeal) => {
        try {
            await addMeal({ variables: { input: meal } });
            toast({
                title: "Success",
                description: "Meal successfully saved!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Error saving meal:", error);
            toast({
                title: "Error",
                description: (error as Error).message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    if (loading) return <Spinner />;
    if (error) return <p>Error: {error.message}</p>;

    const meals: IMeal[] = data.meals;
    const categories: string[] = [...new Set(meals.map(meal => meal.category))];

    // Extract unique ingredients
    const uniqueIngredients = (ingredients: Ingredient[]): Ingredient[] => {
        const ingredientMap: { [key: string]: Ingredient } = {};
        ingredients.forEach(ingredient => {
            ingredientMap[ingredient.name] = ingredient;
        });
        return Object.values(ingredientMap);
    };
    const availableIngredients: Ingredient[] = uniqueIngredients(
        meals.flatMap(meal => meal.ingredients)
      );

    return (
        <Box>
            <MealForm
                categories={categories}
                availableIngredients={availableIngredients}
                onSubmit={handleMealSubmit}
            />
        </Box>
    );
};

export default Meals;