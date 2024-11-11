// src/hooks/useMealDetails.ts
import { useState, useEffect } from 'react';
import { getRequest } from '../services/AxiosClient';
import { MealDetail } from '../interfaces/MealDetail';
import { Ingredient } from '../interfaces/Ingredient';

interface MealDetailsResponse {
    count: number;
    meals: any[]; // Use any to handle dynamic fields initially
}

const useMealDetails = (id: string | null) => {
    const [mealDetails, setMealDetails] = useState<MealDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMealDetails = async (): Promise<void> => {
            if (!id) {
                setMealDetails(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null); // Reset error before fetching

            try {
                const response = await getRequest<MealDetailsResponse>(`lookup.php?i=${id}`);
                const [meal] = response.data.meals;

                if (!meal) {
                    setMealDetails(null);
                    setLoading(false);
                    return;
                }

                // Parse ingredients from the meal object
                const ingredients: Ingredient[] = [];
                for (let i = 1; i <= 20; i++) {
                    const ingredientName = meal[`strIngredient${i}`];
                    const ingredientMeasure = meal[`strMeasure${i}`];
                    if (ingredientName && ingredientName.trim() !== '') {
                        ingredients.push({
                            name: ingredientName,
                            measure: ingredientMeasure || '',
                        });
                    }
                }

                const detailedMeal: MealDetail = {
                    ...meal,
                    ingredients,
                };

                setMealDetails(detailedMeal);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred.');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchMealDetails();
    }, [id]);

    return { mealDetails, error, loading };
}

export default useMealDetails;
