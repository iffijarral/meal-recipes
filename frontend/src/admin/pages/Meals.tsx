import React, { useState, useEffect } from "react";
import { Box, Spinner, useToast } from "@chakra-ui/react";
import MealForm from "../components/MealForm.js"; // Adjust the path as necessary
import { Category } from "../../interfaces/Category.js";
import { AvailableIngredient } from "../../interfaces/AvailableIngredient.js";
import { IMeal } from "../../interfaces/Meal.js";

import { useMutation, useQuery } from "@apollo/client";
import { ADD_MEAL_MUTATION } from "../../graphql/mutations.js";
import { Ingredient } from "../../interfaces/Ingredient.js";

const Meals: React.FC = () => {    
    const [addMeal] = useMutation(ADD_MEAL_MUTATION);
    const toast = useToast();
   
   

   
    

    return (
        <Box>
            <MealForm
                                
            />
        </Box>
    );
};

export default Meals;