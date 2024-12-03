import { Card, CardBody, Image, Heading } from "@chakra-ui/react";
import { IMeal } from "../interfaces/interfaces.js";

interface Props {
    meal: IMeal;
    onClick: () => void; // Handle meal selection
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
            <Image src={`/uploads/${meal.image}`} alt={`${meal.name} - ${meal.id}`} />
            <CardBody>
                <Heading textAlign="center" fontSize="2xl">{meal.name}</Heading>
            </CardBody>
        </Card>
    );
};

export default MealCard;
