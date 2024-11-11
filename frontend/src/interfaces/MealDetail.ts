import { Ingredient } from "./Ingredient";
import { Meal } from "./Meal";

export interface MealDetail extends Meal {
    strInstructions: string;    
    strCategory?: string;
    strArea?: string;
    strTags?: string;
    strYoutube?: string;    
    ingredients: Ingredient[];
}
