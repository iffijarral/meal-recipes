export interface IArea {
    strArea: string;
}
export interface IIngredient {
    name: string;
    measure: string;
}
export interface ICategory {
    idCategory?: string;
    strCategory: string;
    strCategoryThumb?: string;    
}

export interface IUser {
    id: string; // Transformed from `_id`
    name: string;
    email: string;
    role: 'user' | 'admin';
    isActive: boolean;
    isVerified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IMeal {
    id: string; 
    name: string;
    category: string;
    ingredients: IIngredient[];
    tags?: string[]; 
    area: string;
    youtubeLink?: string;
    image: string;
    description: string;
    user: IUser;
    isActive: boolean;
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
    isActive: boolean;
}
export interface IFormData {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;    
}
export interface IUserUpdateFormData {
    name: string;
    email: string;
    isActive: boolean;
}