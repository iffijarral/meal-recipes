import {useState, useEffect} from 'react'
import { Area } from '../interfaces/Area';
import { getRequest } from '../services/AxiosClient';

interface AreaResponse {
    count: number;
    meals: Area[];
}

const useAreas = () => {
    const [areas, setAreas] = useState<Area[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        const fetchAreas = async (): Promise<void> => {
            try {
                const response = await getRequest<AreaResponse>('list.php?a=list');
                
                setAreas(response.data.meals);                                 
                
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

        fetchAreas(); 
    }, []);

  return {areas, error, loading}      

}

export default useAreas