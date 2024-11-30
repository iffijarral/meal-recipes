import { SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import MealCard from './MealCard.js';
import { IMeal } from '../interfaces/interfaces.js';
import { useQuery } from '@apollo/client';
import { GET_MEALS_BY_CATEGORY } from '../graphql/queries.js';

interface Props {
    category: string | undefined;
    onSelectMeal: (meal: IMeal) => void;
}

const MealGrid = ({ category, onSelectMeal }: Props) => {
    const { data, error, loading } = useQuery(GET_MEALS_BY_CATEGORY, { variables: { category }, fetchPolicy: 'network-only'})

    const meals: IMeal[] = data?.mealsByCategory || []; 
    if (loading) return <Spinner size="xl" />;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <SimpleGrid
            columns={{ sm: 1, md: 2, lg: 3 }}
            spacing={10}
            padding={10}
        >
            {meals?.map((meal) => (
                <MealCard
                    key={meal.id}
                    meal={meal}
                    onClick={() => onSelectMeal(meal)} // Pass the meal object on click
                />
            ))}
        </SimpleGrid>    
    );
}

export default MealGrid;
