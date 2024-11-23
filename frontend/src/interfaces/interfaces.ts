export interface IIngredient {
    name: string;
    measure: string;
}
export interface IMealInput {
    name: string;
    category: string;
    ingredients: IIngredient[];
    tags?: string[];
    area: string;
    youtubeLink?: string;
    image: string;
    description: string;
    userId: string; // Instead of user, we use userId for input
}