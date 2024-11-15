import  Meal from '../models/Meal.js'; 

export const mealResolvers = {
    Query: {
      meal: async (_: any, { id }: { id: string }) => {
        return await Meal.findById(id);
      },
      meals: async () => {
        return await Meal.find({});
      }     
    },
    Mutation: {
      addMeal: async (
        _: any,
        { name, category, ingredients, tags, area, youtubeLink, image, description }: any
      ) => {
        const meal = new Meal({
          name,
          category,
          ingredients,
          tags,
          area,
          youtubeLink,
          image,
          description,
        });
        return await meal.save();
      },
    },
  };
  
  