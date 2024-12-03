import { useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/client";
import { Spinner, Text } from "@chakra-ui/react";
import MealGrid from "../components/MealGrid.js";
import { ICategory, IArea } from "../interfaces/interfaces.js";
import MealDetails from "../components/MealDetails.js";
import { GET_CATEGORIES, GET_MEAL_DETAILS } from "../graphql/queries.js";
import AuthContext from "../context/AuthContext.js";

export interface MealQuery {
    category: ICategory | null;
    area: IArea | null;
}

const Home = () => {
    const [mealQuery, setMealQuery] = useState<MealQuery>({ category: null, area: null });
    const [selectedMealId, setSelectedMealId] = useState<string | null>(null);

    // Fetch categories
    const { data, loading: categoriesLoading, error: categoriesError } = useQuery(GET_CATEGORIES, { fetchPolicy: "network-only" });
    const categories: ICategory[] = data?.categories || [];

    // Fetch meal details when a meal is selected
    const { data: mealDetails, loading: mealLoading, error: mealError } = useQuery(GET_MEAL_DETAILS, {
        variables: { id: selectedMealId },
        skip: !selectedMealId, // Only fetch details when a meal is selected
        fetchPolicy: "network-only",
    });

    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { selectedCategory, setSelectedCategory } = authContext;

    useEffect(() => {
        // Set default category when categories are loaded
        if (categories.length > 0 && !mealQuery.category) {
            setMealQuery((prevQuery) => ({ ...prevQuery, category: categories[0] }));
            setSelectedCategory(categories[0])
        }
    }, [categories, mealQuery.category]);

    if (categoriesLoading) return <Spinner size="xl" />;
    if (categoriesError) return <Text>Error loading categories: {categoriesError.message}</Text>;

    return (
        <>
            {selectedMealId ? (
                mealLoading ? (
                    <Spinner size="xl" />
                ) : mealDetails ? (
                    <MealDetails
                        meal={mealDetails.mealById}
                        onClose={() => setSelectedMealId(null)} // Clear selection to return to the grid
                    />
                ) : (
                    <Text>Error loading meal details.</Text>
                )
            ) : (
                mealQuery.category && (
                    <MealGrid
                        onSelectMeal={(meal) => setSelectedMealId(meal.id)} // Set the selected meal ID
                    />
                )
            )}
        </>
    );
};

export default Home;
