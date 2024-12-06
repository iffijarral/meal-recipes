import React, { useState, useEffect, useContext } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Box, Button, HStack, Image, Select, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { ICategory, IMeal } from "../../interfaces/interfaces.js";
import AuthContext from "../../context/AuthContext.js";
import { GET_CATEGORIES_BY_USER, GET_MEALS_BY_CATEGORY_USER } from "../../graphql/queries.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DeleteMealButton from "../components/DeleteMealButton.js";

const Meals = () => {
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [meals, setMeals] = useState<IMeal[] | null>(null);

    const { user, loading: userLoading } = useContext(AuthContext)!;

    const [fetchCategories, { data: categoriesData, loading: categoriesLoading, error: categoriesError }] = useLazyQuery(GET_CATEGORIES_BY_USER);

    const { data: mealsData, loading: mealsLoading, error: mealsError, refetch } = useQuery(GET_MEALS_BY_CATEGORY_USER, {
        variables: { category: selectedCategory?.strCategory, userId: user?.id },
        fetchPolicy: 'network-only',
        skip: !selectedCategory?.strCategory,
    });

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('inside fetch Categories useEffect');
        // Fetch categories when the user is available
        if (user?.id) {
            fetchCategories({ variables: { userId: user.id } });
        }
    }, [user, fetchCategories]);

    useEffect(() => {
        console.log('inside setSelected Category useEffect');
        if (categoriesData?.categoriesByUser?.length > 0 && !selectedCategory) {
            setSelectedCategory(categoriesData.categoriesByUser[0]);
        }
    }, [categoriesData]);

    useEffect(() => {
        console.log('meal data useEffect');
        if (mealsData) {
            setMeals(mealsData.mealsByCategoryUser || []);
        }
    }, [mealsData]);

    useEffect(() => {
        console.log('inside location useeffect');
        if (location.state?.newMeal) {
            const newMeal = location.state.newMeal;
    
            // If selectedCategory is not set, create it from newMeal
            if (!selectedCategory) {
                const category = { strCategory: newMeal.category }; // Assuming the structure of category
                setSelectedCategory(category);
            }
    
            // Add the new meal only if not already present
            setMeals((prevMeals) => {
                const isMealAlreadyAdded = prevMeals?.some(
                    (meal) => meal.id === newMeal.id
                );
                if (isMealAlreadyAdded) return prevMeals; // Skip if meal already exists
                return [...(prevMeals || []), newMeal];
            });
    
            const category = selectedCategory?.strCategory || newMeal.category || "";
            if (category) {
                refetch({ category, userId: user?.id })
                    .then(() => {
                        console.log("Meals refetched successfully.");
                    })
                    .catch((error) => {
                        console.error("Refetch failed:", error);
                    });
            } else {
                console.warn("Refetch skipped: No category available.");
            }
    
            console.log("New meal added:", newMeal);
            // Clear the navigation state after handling it
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, refetch, navigate, selectedCategory, user, setSelectedCategory]);
    
    useEffect(() => {
        if (selectedCategory) {
            console.log('Updated category:', selectedCategory);
            // Perform logic based on updated `selectedCategory`
        }
    }, [selectedCategory]);



    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const categorySelect = event.target.value;
        const category = categoriesData?.categoriesByUser.find((cat: ICategory) => cat.strCategory === categorySelect);

        if (category) {
            refetch({
                category: category.strCategory,
                userId: user?.id
            });
        }
    };

    if (userLoading || categoriesLoading) {
        return <Spinner size="lg" />;
    }

    if (categoriesError) {
        return <p>Error loading categories: {categoriesError.message}</p>;
    }

    return (
        <Box>
            <HStack justifyContent="space-between">
                {/* Dropdown for category selection */}
                <Select
                    size="sm"
                    width="200px"
                    maxW="100%"
                    placeholder="Select Category"
                    onChange={handleCategoryChange}
                    value={selectedCategory ? selectedCategory.strCategory : ''}
                >
                    {categoriesData && categoriesData?.categoriesByUser.map((category: ICategory) => (
                        <option key={category.strCategory} value={category.strCategory}>
                            {category.strCategory}
                        </option>
                    ))}
                </Select>
                <Button onClick={() => navigate('/dashboard/new-meal', { state: { selectedCategory: selectedCategory?.strCategory, userId: user?.id } })} size="sm" mr={2}>
                    New Meal
                </Button>
            </HStack>

            {/* Meal Cards */}
            <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={6} mt={6}>
                {meals === null ? (
                    <Text>No meals available.</Text>
                ) : (
                    meals?.map((meal) => (
                        <Box
                            key={meal.id}
                            borderWidth="1px"
                            borderRadius="lg"
                            overflow="hidden"
                            boxShadow="md"
                            p={4}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Image src={`/uploads/thumbnails/${meal.image}`} alt={meal.name} boxSize="200px" objectFit="cover" />
                            <Text mt={2} fontWeight="bold" fontSize="xl">{meal.name}</Text>
                            {/* Edit and Delete buttons */}
                            <HStack justifyContent="space-between" key={selectedCategory?.strCategory}>
                                <Button as={Link} to={`/dashboard/edit-meal/${meal.id}`} colorScheme="blue" size="sm" mt={2} mr={2}>
                                    Edit
                                </Button>
                                {selectedCategory?.strCategory && user?.id && (
                                    <DeleteMealButton
                                        mealId={meal.id}
                                        selectedCategory={selectedCategory.strCategory}
                                        userId={user.id}
                                    />
                                )}
                            </HStack>
                        </Box>
                    ))
                )}
            </SimpleGrid>
        </Box>
    );
};

export default Meals;
