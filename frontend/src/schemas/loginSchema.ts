import Joi from 'joi';
import { userSchema } from "./userSchema";

// Schema for login (extract only the necessary fields)
export const loginSchema = Joi.object({
    email: userSchema.extract('email'),
    password: userSchema.extract('password'),
});