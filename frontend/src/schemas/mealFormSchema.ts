import Joi from "joi";

const mealFormSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Meal name is required.",
      "any.required": "Meal name is required.",
    }),
  category: Joi.string()
    .allow(null, "")
    .messages({
      "string.empty": "Category cannot be empty.",
    }),
  newCategory: Joi.string()
    .allow(null, "")
    .messages({
      "string.empty": "New category cannot be empty.",
    }),
  ingredients: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().required().messages({
          "string.empty": "Ingredient name cannot be empty.",
        }),
        measure: Joi.string().trim().required().messages({
          "string.empty": "Ingredient measure cannot be empty.",
        }),
      })
    )
    .min(1)
    .messages({
      "array.min": "At least one ingredient is required.",
    }),
  tags: Joi.array().items(Joi.string().trim()).messages({
    "array.base": "Tags should be a list of strings.",
  }),
  area: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Area is required.",
      "any.required": "Area is required.",
    }),
  description: Joi.string()
    .trim()
    .max(500)
    .allow("")
    .messages({
      "string.max": "Description cannot exceed 500 characters.",
    }),
  file: Joi.any()
    .allow(null)
    .messages({
      "any.invalid": "Invalid file type.",
    }),
  youtubeLink: Joi.string()
    .trim()
    .uri()    
    .messages({
      "string.uri": "YouTube link must be a valid URL.",      
    }),
}).or("category", "newCategory").messages({
  "object.missing": "Please select a category or provide a new category.",
});

export default mealFormSchema;
