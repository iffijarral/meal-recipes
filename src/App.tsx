// src/App.tsx
import { Grid, GridItem, Show, Spinner, Text } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import MealGrid from "./components/MealGrid";
import CategoryListAside from "./components/CategoryListAside";
import { Category } from "./interfaces/Category";
import { useState, useEffect } from "react";
import useCategories from "./hooks/useCategories";
import { Area } from "./interfaces/Area";
import useAreas from "./hooks/useAreas";
import AreaListAside from "./components/AreaListAside";
import { MealDetail } from "./interfaces/MealDetail";
import useMealDetails from "./hooks/useMealDetails";
import MealDetails from "./components/MealDetails";

export interface MealQuery {
    category: Category | null;
    area: Area | null;  
}

function App() {
    const [mealQuery, setMealQuery] = useState<MealQuery>({ category: null, area: null });
    const [selectedMealId, setSelectedMealId] = useState<string | null>(null);

    // Fetch categories and areas
    const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
    const { areas, loading: areasLoading, error: areasError } = useAreas();

    // Fetch meal details when a meal is selected
    const { mealDetails, error: mealError, loading: mealLoading } = useMealDetails(selectedMealId);

    console.log('selected mealId:', selectedMealId);
    console.log('mealDetails:', mealDetails);

    useEffect(() => {
        if (categories.length > 0 && !mealQuery.category) {
            setMealQuery({ category: categories[0], area: null });
        }
    }, [categories, mealQuery.category]);

    // Handle loading and error states for categories and areas
    if (categoriesLoading || areasLoading) return <Spinner size="xl" />;
    if (categoriesError) return <Text>Error loading categories: {categoriesError}</Text>;
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
                </GridItem>
            </Show>
            <GridItem area={"main"}>
                {selectedMealId && mealDetails ? (
                    <MealDetails
                        meal={mealDetails}
                        onClose={() => setSelectedMealId(null)}
                    />
                ) : (
                    mealQuery.category && (
                        <MealGrid 
                            category={mealQuery.category.strCategory} 
                            onSelectMeal={(meal) => setSelectedMealId(meal.idMeal)} 
                        />
                    )
                )}
            </GridItem>
        </Grid>
    );
}

export default App;
