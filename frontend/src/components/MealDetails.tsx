import { Box, Button, Heading, Text, Image, List, ListItem, Link, Flex } from "@chakra-ui/react";
import { IMeal } from "../interfaces/interfaces.js";

interface Props {
    meal: IMeal | null;
    onClose?: () => void; // Handle optional `onClose`
}

const MealDetails = ({ meal, onClose }: Props) => {
    if (!meal) return <Text>No meal details available.</Text>;

    return (
        <Box p={5}>
            {/* Back Button for Mobile & Desktop */}
            {onClose && (
                <Button 
                    onClick={onClose} 
                    mb={4} 
                    variant="outline"
                >
                    Back
                </Button>
            )}

            {/* Main container with responsive layout */}
            <Flex
                direction={{ base: "column", md: "row" }} // Stack vertically on small screens
                gap={4}
                align="flex-start"
            >
                {/* Text details container */}
                <Box
                    flex="1"
                    p={2}
                    width={{ base: "100%", md: "60%", lg: "50%" }} 
                >
                    <Heading size="md" mb={2}>{meal.name}</Heading>
                    <Text mb={2}>
                        <strong>Category:</strong> {meal.category}
                    </Text>
                    <Text mb={2}>
                        <strong>Area:</strong> {meal.area}
                    </Text>

                    <Text mt={2}>
                        <strong>Instructions:</strong>
                    </Text>
                    <Text mb={4}>{meal.description}</Text>

                    {meal.tags && (
                        <Text mb={2}>
                            <strong>Tags:</strong> {meal.tags}
                        </Text>
                    )}

                    {meal.youtubeLink && (
                        <Text mb={4}>
                            <Link href={meal.youtubeLink} color="teal.500" isExternal>
                                Watch on YouTube
                            </Link>
                        </Text>
                    )}

                    {/* Ingredients section */}
                    {meal.ingredients?.length > 0 && (
                        <>
                            <Heading mt={4} size="sm">Ingredients</Heading>
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

                {/* Image Section */}
                <Image
                    src={`/uploads/${meal.image}`}
                    alt={meal.name}
                    borderRadius="lg"
                    mt={{ base: 4, md: 0 }}
                    ml={{ base: 0, md: 4 }}
                    boxSize={{ base: "100%", md: "300px", lg: "350px" }}
                    objectFit="cover"
                />
            </Flex>
        </Box>
    );
};

export default MealDetails;
