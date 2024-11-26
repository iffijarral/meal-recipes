import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { mealResolvers } from './meal.js';
import { userResolvers } from './user.js';
console.log("mealResolvers:", mealResolvers);
console.log("userResolvers:", userResolvers);

export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    ...mealResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...mealResolvers.Mutation,
    ...userResolvers.Mutation,
  },
};
