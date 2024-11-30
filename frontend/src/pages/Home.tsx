import { useState, useEffect } from "react";
import { Grid, GridItem, Show, Spinner, Text } from "@chakra-ui/react";
import NavBar from "../components/NavBar.js";
import MealGrid from "../components/MealGrid.js";
import CategoryListAside from "../components/CategoryListAside.js";
import { Category } from "../interfaces/Category.js";
import useCategories from "../hooks/useCategories.js";
import { Area } from "../interfaces/Area.js";
import useAreas from "../hooks/useAreas.js";
import AreaListAside from "../components/AreaListAside.js";
import useMealDetails from "../hooks/useMealDetails.js";
import MealDetails from "../components/MealDetails.js";
import IngredientListAside from "../components/IngredientListAside.js";
import { AvailableIngredient } from "../interfaces/AvailableIngredient.js";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES, GET_MEAL_DETAILS } from "../graphql/queries.js";

export interface MealQuery {
    category: Category | null;
    area: Area | null;    
}

const Home = () => {
    const [mealQuery, setMealQuery] = useState<MealQuery>({ category: null, area: null });
    const [selectedMealId, setSelectedMealId] = useState<string | null>(null);

    // Fetch categories and areas
    const { data, loading: categoriesLoading, error: categoriesError } = useQuery(GET_CATEGORIES, {fetchPolicy: 'network-only'});
    const { areas, loading: areasLoading, error: areasError } = useAreas();
    
    const categories: Category[] = data?.categories || [];
    // Fetch meal details when a meal is selected
    const { data: mealDetails, error: mealError, loading: mealLoading } = useQuery(GET_MEAL_DETAILS, {variables: {id: selectedMealId}, fetchPolicy: 'network-only'});    
    // console.log('meal details', mealDetails?.mealById);
    useEffect(() => {
        if (categories.length > 0 && !mealQuery.category) {
            setMealQuery({ category: categories[0], area: null });
        }
    }, [categories, mealQuery.category]);

    // Handle loading and error states for categories and areas
    if (categoriesLoading || areasLoading) return <Spinner size="xl" />;
    if (categoriesError) return <Text>Error loading categories: {categoriesError.message}</Text>;
    if (areasError) return <Text>Error loading areas: {areasError}</Text>;

    return (
        <Grid
            padding={4}
            templateAreas={{
                lg: `"nav nav"
                     "aside main"`,
                base: `"nav" "main"`,
            }}
            templateColumns={{
                lg: "200px 1fr",
                base: "1fr",
            }}
            height="100vh"
        >
            <GridItem area={"nav"}>
                <NavBar />
            </GridItem>
            <Show above="lg">
                <GridItem area={"aside"} overflowY="auto">
                    <CategoryListAside
                        selectedCategory={mealQuery.category}
                        onSelectCategory={(category) => setMealQuery({ ...mealQuery, category })}
                    />
                     <AreaListAside
                        selectedArea={mealQuery.area}
                        onSelectArea={(area) => setMealQuery({ ...mealQuery, area })}
                    />
                    {/*<IngredientListAside
                        selectedIngredient={mealQuery.ingredient}
                        onSelectIngredient={(ingredient) => setMealQuery({ ...mealQuery, ingredient })}
                    /> */}
                </GridItem>
            </Show>
            <GridItem area={"main"}>
                {selectedMealId && mealDetails ? (
                    <MealDetails
                        meal={mealDetails.mealById}
                        onClose={() => setSelectedMealId(null)}
                    />
                ) : (
                    mealQuery.category && (
                        <MealGrid 
                            category={mealQuery.category.strCategory} 
                            onSelectMeal={(meal) => setSelectedMealId(meal.id)} 
                        />
                    )
                )}
            </GridItem>
        </Grid>
    );
}

export default Home;
