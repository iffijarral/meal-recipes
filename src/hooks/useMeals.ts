import {useState, useEffect} from 'react'
import { Meal } from '../interfaces/Meal'
import { getRequest } from '../services/AxiosClient';

interface MealResponse {
    count: number;
    meals: Meal[];
}
interface Props {
    category: string | undefined;
}
const useMeals = ({category}: Props) => {

    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        const fetchMeals = async (): Promise<void> => {
            try {                                                                 
                const response = await getRequest<MealResponse>('filter.php?c='+category);
                
                setMeals(response.data.meals);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message); // Use the error message
                } else {
                    setError('An unknown error occurred.'); // Fallback for non-Error objects
                }
            } finally {
                setLoading(false);
            }
        }

        fetchMeals(); 
    }, [category]);

  return {meals, error, loading}      

}

export default useMeals