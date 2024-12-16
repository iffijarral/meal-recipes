export interface IIngredient {
    name: string;
    measure: string;
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

export interface IUserInput {
    name: string
    email: string
    password: string
    confirmPassword: string
    role: string
    isActive: boolean
    isVerified: boolean
}
export interface IUserUpdateInput {
    name: string
    email: string    
    isActive: boolean    
}
export interface ILoginInput {
    email: string;
    password: string;
}
export interface Image {
    filename: string;
}

export interface ICategory {
    idCategory: string | null;
    strCategory: string;
    strCategoryThumb: string | null;
}

export interface IArea {
    strArea: string;
}