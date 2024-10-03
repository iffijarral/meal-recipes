// src/components/MealGrid.tsx
import { SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import useMeals from '../hooks/useMeals';
import MealCard from './MealCard';
import { Meal } from '../interfaces/Meal';

interface Props {
    category: string | undefined;
    onSelectMeal: (meal: Meal) => void;
}

const MealGrid = ({ category, onSelectMeal }: Props) => {
    const { meals, error, loading } = useMeals({ category });

    if (loading) return <Spinner size="xl" />;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <SimpleGrid
            columns={{ sm: 1, md: 2, lg: 3 }}
            spacing={10}
            padding={10}
        >
            {meals.map((meal) => (
                <MealCard
                    key={meal.idMeal}
                    meal={meal}
                    onClick={() => onSelectMeal(meal)} // Pass the meal object on click
                />
            ))}
        </SimpleGrid>    
    );
}

export default MealGrid;
