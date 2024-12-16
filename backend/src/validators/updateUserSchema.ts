import Joi from 'joi';
import { userSchema } from "./userSchema.js";

// Schema for login (extract only the necessary fields)
export const updateUserSchema = Joi.object({
    name: userSchema.extract('name'),
    email: userSchema.extract('email'),
    isActive: Joi.boolean().optional(),    
}); 