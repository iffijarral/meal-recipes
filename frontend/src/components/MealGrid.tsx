import { useContext } from "react";
import { useQuery } from "@apollo/client";
import { SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import MealCard from "./MealCard.js";
import { IMeal } from "../interfaces/interfaces.js";
import { GET_MEALS_BY_AREA, GET_MEALS_BY_CATEGORY } from "../graphql/queries.js";
import AuthContext from "../context/AuthContext.js";

interface Props {
    onSelectMeal: (meal: IMeal) => void;
}

const MealGrid = ({ onSelectMeal }: Props) => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { selectedCategory, selectedArea } = authContext;

    // Fetch meals by area if `selectedArea` is set, otherwise by category
    const { data: mealsData, error: mealsError, loading: mealsLoading } = useQuery(
        selectedArea ? GET_MEALS_BY_AREA : GET_MEALS_BY_CATEGORY,
        {
            variables: selectedArea
                ? { area: selectedArea.strArea }
                : { category: selectedCategory?.strCategory },
            skip: !selectedArea && !selectedCategory, // Skip if neither is set
            fetchPolicy: "network-only",
        }
    );

    const meals: IMeal[] = mealsData?.mealsByArea || mealsData?.mealsByCategory || [];

    if (mealsLoading) return <Spinner size="xl" />;
    

    
    if (mealsError) return <Text>Error loading meals: {mealsError.message}</Text>;

    return (
        <SimpleGrid
            columns={{ sm: 1, md: 3 }}
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
