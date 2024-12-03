import Joi from 'joi';

// User validation schema using Joi
export const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        'string.empty': 'Name cannot be empty.', 
        'string.min': 'Name must be at least 3 characters long.',
        'string.max': 'Name must not exceed 30 characters.',        
        'any.required': 'Name is required.',
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.empty': 'Email cannot be empty.', // Custom message for empty email
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required.',
    }),
    password: Joi.string()
        .min(8)
        .max(30)
        .pattern(new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&*!])'))
        .required()
        .messages({
            'string.empty': 'Password cannot be empty.', // Custom message for empty password
            'string.min': 'Password must be at least 8 characters long.',
            'string.max': 'Password must not exceed 30 characters.',
            'string.pattern.base': 'Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character.',
            'any.required': 'Password is required.',
        }),
    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'string.empty': 'Confirm password cannot be empty.',
            'any.required': 'Confirm password cannot be empty.',
            'any.only': 'Confirm password must match the password.',            
    }),
    role: Joi.string().required(),
    isActive: Joi.boolean().required(),
    isVerified: Joi.boolean().required()
});