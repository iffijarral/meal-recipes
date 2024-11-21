import Joi from 'joi';

// User validation schema using Joi
export const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string()
        .min(8)
        .max(30)
        .pattern(new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&*!])'))
        .required()
        .messages({
            'string.pattern.base': 'Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character.',
        }),
    role: Joi.string().required(),
    isActive: Joi.boolean().required(),
    isVerified: Joi.boolean().required()
});