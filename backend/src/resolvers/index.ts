import { mealResolvers } from './meal.js';
import { userResolvers } from './user.js';

export const resolvers = {
  Query: {
    ...mealResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...mealResolvers.Mutation,
    ...userResolvers.Mutation,
  },
};
