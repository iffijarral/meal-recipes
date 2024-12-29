import path from 'path';
import fs from 'fs';
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { FileUpload } from "graphql-upload/processRequest.mjs";
import { IArea, ICategory, Image, IMeal, IMealInput, IUser } from '../interfaces/interfaces.js';
import { mealService } from '../services/mealService.js';
import { checkPermissionMutation } from '../utils/checkPermission.js';


// Deriving the __dirname equivalent from import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Resolvers
export const mealResolvers = {
  // Scalar for handling file uploads
  // Upload: GraphQLUpload,

  // Query resolver to fetch all images
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
    mealById: async (_: any, { id }: { id: string }): Promise<IMeal | null > => {
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
    mealByName: async (_: any, { name }: { name: string }): Promise<IMeal | null > => {
      try {
        return await mealService.getMealByName(name);
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
    mealsByCategory: async (_: any, { category }: { category: string }): Promise<IMeal[] | null > => {
      try {
        return await mealService.getMealsByCategory(category);
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

    mealsByArea: async (_: any, { area }: { area: string }): Promise<IMeal[] | null > => {
      try {
        return await mealService.getMealsByArea(area);
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

    mealsByCategoryUser: async (_: any, { category, userId }: { category: string, userId: string }): Promise<IMeal[] | null > => {
      try {
        return await mealService.getMealsByCategoryUser(category, userId);
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

    categoriesByUser: async (_: any, { userId }: { userId: string }): Promise<ICategory[] | null > => {
      try {
        return await mealService.getCategoriesByUser(userId);
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
    categories: async (): Promise<ICategory[]> => {
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
    areas: async (): Promise<IArea[]> => {
      try {
        return await mealService.getDistinctAreas();
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error during areas fetch operation:', error.message);
          throw new Error(error.message);
        } else {
          console.error('Unexpected error:', error);
          throw new Error('Unexpected error during areas fetch');
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

  // Mutation resolver to handle file uploads
  Mutation: {
    addMeal: async (_: any, { input }: { input:IMealInput }, context: { user: IUser }) => {

      const { user } = context;          

      if (!user) {
        throw new Error('Not authenticated');
      }

      checkPermissionMutation('addMeal', user);

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
    updateMeal: async (_: any, { id, input }: { id: string, input: IMealInput }, context: { user: IUser }): Promise<IMeal | null > => {


      const { user } = context;          

      if (!user) {
        throw new Error('Not authenticated');
      }

      checkPermissionMutation('updateMeal', user);

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
    deleteMeal: async (_: any, { id }: { id: string }, context: { user: IUser }): Promise<{success: boolean, message: string, mealId: string} | {}> => {
      
      const { user } = context;          

      if (!user) {
        throw new Error('Not authenticated');
      }

      checkPermissionMutation('deleteMeal', user);
      
      try {
        return await mealService.deleteMeal(id);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error during meal delete operation:', error.message);
          throw new Error(error.message);
        } else {
          console.error('Unexpected error:', error);
          throw new Error('Unexpected error during meal deletion');
        }
      }
    },
    uploadImage: async (
      _: unknown,
      { image }: { image: Promise<FileUpload> } // Arguments with typing
      , context: { user: IUser }
    ): Promise<Image> => {
      
      const { user } = context;

      if (!user) {
        throw new Error('Not authenticated');
      }

      checkPermissionMutation('uploadImage', user);

      try { 
        const uploadedImage = await mealService.uploadImage(image);
        await mealService.generateThumbnail(uploadedImage.filename);
        return uploadedImage;
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error during image upload operation at backend:', error.message);
          throw new Error(error.message);
        } else {
          console.error('Unexpected error while image upload backend:', error);
          throw new Error('Unexpected error during image upload');
        }
      }      
    },    
  },
};
