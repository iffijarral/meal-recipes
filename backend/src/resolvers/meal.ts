import { mealService } from '../services/mealService.js';
import { IMealInput } from '../interfaces/interfaces.js';



export const mealResolvers = {
  Query: {    
    meals: async () => {
      try {
        return await mealService.getAllMeals();
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error during meal fetch operation:', error.message);
          throw new Error(error.message);
        } else {
          console.error('Unexpected error:', error);
          throw new Error('Unexpected error during meal fetch');
        }        
      }
    },
    meal: async (_: any, { id }: { id: string }) => {
      try {
        return await mealService.getMealById(id);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error during meal fetch operation:', error.message);
          throw new Error(error.message);
        } else {
          console.error('Unexpected error:', error);
          throw new Error('Unexpected error during meal fetch');
        }
      }
    },
    categories: async () => {
      try {
        return await mealService.getDistinctCategories();
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error during categories fetch operation:', error.message);
          throw new Error(error.message);
        } else {
          console.error('Unexpected error:', error);
          throw new Error('Unexpected error during categories fetch');
        }
      }
    },
    ingredients: async () => {
      try {
        return await mealService.getDistinctIngredients();
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error during ingredients fetch operation:', error.message);
          throw new Error(error.message);
        } else {
          console.error('Unexpected error:', error);
          throw new Error('Unexpected error during ingredients fetch');
        }
      }
    },
  },
  Mutation: {    
    addMeal: async (_: any, { input }: { input:IMealInput }) => {
      try {
        return await mealService.createMeal(input);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error during meal creation operation:', error.message);
          throw new Error(error.message);
        } else {
          console.error('Unexpected error:', error);
          throw new Error('Unexpected error during meal creation');
        }
      }
    },
    updateMeal: async (_: any, { id, input }: { id: string, input: IMealInput }) => {
      try {
        return await mealService.updateMeal(id, input);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error during meal update operation:', error.message);
          throw new Error(error.message);
        } else {
          console.error('Unexpected error:', error);
          throw new Error('Unexpected error during meal update');
        }
      }
    },
    deleteMeal: async (_: any, { id }: { id: string }) => {
      try {
        return await mealService.deleteMeal(id);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error during meal deletion operation:', error.message);
          throw new Error(error.message);
        } else {
          console.error('Unexpected error:', error);
          throw new Error('Unexpected error during meal deletion');
        }
      }
    },
  },
};