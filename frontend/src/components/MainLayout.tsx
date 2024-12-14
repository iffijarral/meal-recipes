import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Box, Grid, GridItem, Show, Spinner, Text } from "@chakra-ui/react";
import NavBar from "./NavBar.js";
import CategoryListAside from "./CategoryListAside.js";
import AreaListAside from "./AreaListAside.js";
import MealDetails from "./MealDetails.js";
import { GET_MEAL_BY_NAME } from "../graphql/queries.js";
import { IMeal } from "../interfaces/interfaces.js";

const MainLayout = () => {

    const [selectedMeal, setSelectedMeal] = useState<IMeal | null>(null); // Track the selected meal
    const [getMeal, { data, loading, error }] = useLazyQuery(GET_MEAL_BY_NAME);
    const [notFoundMessage, setNotFoundMessage] = useState<string | null>(null);

    // This function is called when a meal is found via the search
    const handleSearch = (query: string) => {
        // Reset previous state
        setNotFoundMessage(null);
        setSelectedMeal(null);

        // Trigger the query when search input is received
        getMeal({ variables: { name: query } });
    };

    useEffect(() => {
        if (data?.mealByName) {
            setSelectedMeal(data.mealByName);
        } else if (!loading && data && !data.mealByName) {
            setNotFoundMessage('No meal found for the given name.');
        }
    }, [data, loading]);

    return (
        <Box
            maxWidth="1200px" // Set the maximum width for the entire layout
            margin="0 auto"   // Center the content horizontally
            
        >
            <Grid                
                templateAreas={{
                    lg: `"nav nav"
                     "aside main"`,
                    md: `"nav nav"
                     "aside main"`,
                    base: `"nav"
                       "main"`,
                }}
                templateColumns={{
                    lg: "200px 1fr",
                    md: "150px 1fr",
                    base: "1fr",
                }}
                height="100vh"
            >
                <GridItem area={"nav"}>
                    <NavBar onSearch={handleSearch} />
                </GridItem>
                <Show above="md">
                    <GridItem area={"aside"} alignContent="start" overflowY="auto">
                        <CategoryListAside />
                        <AreaListAside />
                    </GridItem>
                </Show>
                <GridItem area={"main"}>
                    {selectedMeal ? (
                        <MealDetails
                            meal={selectedMeal}
                            onClose={() => setSelectedMeal(null)} // Clear selection to return to the grid
                        />
                    ) : notFoundMessage ? ( // Show "No meal found" message if applicable
                        <Box textAlign="center" p={4}>
                            <Text fontSize="lg">
                                {notFoundMessage}
                            </Text>
                        </Box>
                    ) : loading ? ( // Show loading spinner if data is being fetched
                        <Box textAlign="center" p={4}>
                            <Spinner size="lg" color="blue.500" />
                            <Text mt={2} fontSize="md" color="gray.600">
                                Loading...
                            </Text>
                        </Box>
                    ) : error ? ( // Show error message if there's a query error
                        <Box textAlign="center" p={4}>
                            <Text fontSize="lg">
                                {error.message}
                            </Text>
                        </Box>
                    ) : (
                        <Outlet />
                    )}
                </GridItem>

            </Grid>
        </Box>
    );
};

export default MainLayout;
