import React, { useEffect, useState } from 'react'
import { getRequest } from '../services/AxiosClient';
import { AvailableIngredient } from '../interfaces/AvailableIngredient';

interface AvailableIngredientResponse {
    count: number;
    meals: AvailableIngredient[];
}
const useAvailableIngredients = () => {
    const [ingredients, setIngredients] = useState<AvailableIngredient[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAvailableIngredients = async (): Promise<void> => {
            try {
                const response = await getRequest<AvailableIngredientResponse>(`list.php?i=list`);
                setIngredients(response.data.meals);                             
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

        fetchAvailableIngredients();
    }, [])
    return { ingredients, error, loading }
}

export default useAvailableIngredients;