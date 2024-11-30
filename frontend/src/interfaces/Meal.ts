import { Ingredient } from "./Ingredient.js";
import { IUser } from "./User.js";

export interface IMealDetails {
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