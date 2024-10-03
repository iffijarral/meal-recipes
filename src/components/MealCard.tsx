// src/components/MealCard.tsx
import { Card, CardBody, Image, Heading, Box } from '@chakra-ui/react';
import { Meal } from '../interfaces/Meal';

interface Props {
    meal: Meal;
    onClick: () => void;
}

const MealCard = ({ meal, onClick }: Props) => {
    return (
        <Card 
            borderRadius="10" 
            overflow="hidden" 
            onClick={onClick} 
            cursor="pointer"
            _hover={{ boxShadow: "lg" }}
            transition="box-shadow 0.2s"
        >
            <Image src={meal.strMealThumb} alt={`${meal.strMeal} - ${meal.idMeal}`} />
            <CardBody>
                <Heading textAlign="center" fontSize="2xl">{meal.strMeal}</Heading>
            </CardBody>
        </Card>
    );
}

export default MealCard;
