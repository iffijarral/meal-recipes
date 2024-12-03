import Joi from 'joi';

// Search validation schema using Joi
export const searchSchema = Joi.object({
  query: Joi.string()
    .min(3) // Minimum length of 3 characters
    .max(50) // Maximum length of 50 characters (you can adjust this based on your needs)
    .required() // The search input is required
    .messages({
      'string.empty': 'Please provide a valid meal name.', // Custom message for empty string
      'string.min': 'Meal name must be at least 3 characters long.',
      'string.max': 'Meal name cannot be longer than 50 characters.',
      'any.required': 'Meal name is required.', // Message for when the input is missing
    }),
});