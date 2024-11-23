import { Ingredient } from "./Ingredient";
import { IUser } from "./User";

export interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;    
}

export interface IMeal {
    id?: string;
    name: string;
    category: string;
    ingredients: Ingredient[];
    tags?: string[];
    area: string;
    youtubeLink?: string;
    image: string;
    description: string;
    user: IUser; // Assuming you want the full user object here
  }