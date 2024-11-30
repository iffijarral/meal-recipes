import {useState, useEffect} from 'react'
import { Category } from '../interfaces/Category.js'
import { getRequest } from '../services/AxiosClient.js';

interface CategoryResponse {
    count: number;
    categories: Category[];
}

const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        const fetchCategories = async (): Promise<void> => {
            try {
                const response = await getRequest<CategoryResponse>('categories.php');
                
                setCategories(response.data.categories);
                                 
                
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

        fetchCategories(); 
    }, []);

  return {categories, error, loading}      

}

export default useCategories