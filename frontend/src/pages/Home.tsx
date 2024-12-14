import { useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/client";
import { Spinner, Text, HStack, Box } from "@chakra-ui/react";
import MealGrid from "../components/MealGrid.js";
import MealDetails from "../components/MealDetails.js";
import { GET_CATEGORIES, GET_MEAL_DETAILS } from "../graphql/queries.js";
import AuthContext from "../context/AuthContext.js";
import CategoryListAside from "../components/CategoryListAside.js";
import AreaListAside from "../components/AreaListAside.js";
import { ICategory } from "../interfaces/interfaces.js";

const Home = () => {
    const [selectedMealId, setSelectedMealId] = useState<string | null>(null);

    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("AuthContext must be used within an AuthProvider");

    const { selectedCategory, setSelectedCategory } = authContext;

    const { data, loading: categoriesLoading, error: categoriesError } = useQuery(GET_CATEGORIES, { fetchPolicy: "network-only" });
    const categories: ICategory[] = data?.categories || [];


    // Fetch meal details when a meal is selected
    const {
        data: mealDetails,
        loading: mealLoading,
        error: mealError,
    } = useQuery(GET_MEAL_DETAILS, {
        variables: { id: selectedMealId },
        skip: !selectedMealId, // Skip query unless a meal is selected
        fetchPolicy: "network-only",
    });

    // Automatically select the first category on app startup if none is selected
    useEffect(() => {
        if (!selectedCategory && categories?.length > 0) {
            setSelectedCategory(categories[0]);
        }
    }, [categories, selectedCategory, setSelectedCategory]);

    if (mealLoading) return <Spinner size="xl" />;
    if (mealError) return <Text>Error loading meals: {mealError.message}</Text>;

    return (

        <>
            {selectedMealId ? (
                // Show Meal Details if a meal is selected
                mealLoading ? (
                    <Spinner size="xl" />
                ) : mealError ? (
                    <Text>Error loading meal details: {mealError}</Text>
                ) : (
                    <MealDetails
                        meal={mealDetails?.mealById}
                        onClose={() => setSelectedMealId(null)} // Close MealDetails
                    />
                )
            ) : (
                // Show MealGrid otherwise
                <MealGrid
                    onSelectMeal={(meal) => setSelectedMealId(meal.id)} // Set selected meal ID
                />
            )}

        </>
    );
};

export default Home;
