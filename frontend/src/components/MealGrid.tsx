import { useContext } from "react";
import { useQuery } from "@apollo/client";
import { SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import MealCard from "./MealCard.js";
import { IMeal } from "../interfaces/interfaces.js";
import { GET_MEALS_BY_CATEGORY } from "../graphql/queries.js";
import AuthContext from "../context/AuthContext.js";

interface Props {
    onSelectMeal: (meal: IMeal) => void;
}

const MealGrid = ({ onSelectMeal }: Props) => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { selectedCategory, setSelectedCategory } = authContext;

    // Fetch meals by category
    const { data: mealData, error: mealError, loading: mealLoading } = useQuery(GET_MEALS_BY_CATEGORY, {
        variables: { category: selectedCategory?.strCategory },
        skip: !selectedCategory, // Only fetch meals if a category is selected
        fetchPolicy: "network-only",
    });

    const meals: IMeal[] = mealData?.mealsByCategory || [];

    if (mealLoading) return <Spinner size="xl" />;
    if (mealError) return <Text>Error loading meals: {mealError.message}</Text>;

    return (
        <SimpleGrid
            columns={{ sm: 1, md: 2, lg: 3 }}
            spacing={10}
            padding={10}
        >
            {meals.map((meal) => (
                <MealCard
                    key={meal.id}
                    meal={meal}
                    onClick={() => onSelectMeal(meal)} // Pass meal to parent
                />
            ))}
        </SimpleGrid>
    );
};

export default MealGrid;
