import Joi from 'joi';

export const mealSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  ingredients: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      measure: Joi.string().required(),
    })
  ).required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  youtubeLink: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  area: Joi.string(),
  userId: Joi.string().required(),
});