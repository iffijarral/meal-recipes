import Joi from 'joi';

const fileSchema = Joi.object({
    type: Joi.string()
        .valid("image/jpeg", "image/png", "image/webp")
        .required()
        .messages({
            "any.only": "Only JPG, PNG, and WEBP files are allowed.",
            "any.required": "File type is required.",
        }),
    size: Joi.number()
        .max(5 * 1024 * 1024) // Maximum 5MB
        .required()
        .messages({
            "number.max": "File size should not exceed 5MB.",
            "any.required": "File size is required.",
        }),
});

export default fileSchema;