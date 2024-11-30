import { Box, Button, Heading, Text, Image, List, ListItem, Link, Flex } from "@chakra-ui/react";
import { IMeal } from "../interfaces/interfaces.js";

interface Props {
    meal: IMeal | null;
    onClose: () => void;
}

const MealDetails = ({ meal, onClose }: Props) => {
    if (!meal) return <Text>No meal details available.</Text>;
    console.log('meal object', meal);
    return (
        <Box p={5}>
            <Button onClick={onClose} mb={4}>Back</Button>
            
            <Flex direction={{ base: "column", md: "row" }} gap={2} alignItems="start">
                <Box flex="1">
                    <Heading mt={4}>{meal.name}</Heading>
                    <Text mt={2}><strong>Category:</strong> {meal.category}</Text>
                    <Text mt={2}><strong>Area:</strong> {meal.area}</Text>
                    <Text mt={4}><strong>Instructions:</strong></Text>
                    <Text mt={2}>{meal.description}</Text>

                    {meal.tags && (
                        <Text mt={2}><strong>Tags:</strong> {meal.tags}</Text>
                    )}

                    {meal.youtubeLink && (
                        <Text mt={2}>
                            <Link href={meal.youtubeLink} color="teal.500" isExternal>
                                Watch on YouTube
                            </Link>
                        </Text>
                    )}

                    {meal.ingredients && meal.ingredients.length > 0 && (
                        <>
                            <Heading mt={4} size="md">Ingredients</Heading>
                            <List spacing={2}>
                                {meal.ingredients.map((ingredient, index) => (
                                    <ListItem key={index}>
                                        {ingredient.name} - {ingredient.measure}
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </Box>
                <Image 
                     src={`/uploads/${meal.image}`} 
                     alt={meal.name} 
                     borderRadius="lg" 
                     ml={{ base: 0, md: 4 }} // margin-left on medium screens
                     mt={{ base: 4, md: 0 }} // margin-top for small screens
                     boxSize={{ base: "100%", md: "300px" }} // responsive image size
                     objectFit="cover"
                />
            </Flex>

        </Box>
    );
}

export default MealDetails;
