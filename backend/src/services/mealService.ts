import { Meal } from "../models/Meal.js";
import { IMealInput } from "../interfaces/interfaces.js";
import { mealSchema } from "../validators/mealValidator.js";

export const mealService = {
  // Creating a new meal
  createMeal: async (mealData: IMealInput) => {
    const { error } = mealSchema.validate(mealData);
    if (error) {
      throw new Error(`Validation failed: ${error.details.map(e => e.message).join(", ")}`);
    }
    
    const newMeal = new Meal({
      ...mealData,
      user: mealData.userId, // Map userId to user field
    });

    await newMeal.save();
    return newMeal;
  },

  // Update a meal
  updateMeal: async (id: string, mealData: IMealInput) => {
    const { error } = mealSchema.validate(mealData);
    if (error) {
      throw new Error(`Validation failed: ${error.details.map(e => e.message).join(", ")}`);
    }

    const updatedMeal = await Meal.findByIdAndUpdate(id, mealData, { new: true });
    if (!updatedMeal) {
      throw new Error("Meal not found");
    }
    return updatedMeal;
  },

  // Delete a meal
  deleteMeal: async (id: string) => {
    const deletedMeal = await Meal.findByIdAndDelete(id);
    if (!deletedMeal) {
      throw new Error("Meal not found");
    }
    return deletedMeal;
  },

  // Fetch meal by ID
  getMealById: async (id: string) => {
    const meal = await Meal.findById(id).populate('user');
    if (!meal) {
      throw new Error("Meal not found");
    }
    return meal;
  },

  // Fetch all meals
  getAllMeals: async () => {
    return await Meal.find({}).populate('user');
  },

  // Fetch meals by category
  getMealsByCategory: async (category: string) => {
    return await Meal.find({ category }).populate('user');
  },

  // Fetch distinct categories
  getDistinctCategories: async () => {
    const categories = await Meal.distinct('category');
    return categories;
  },

  // Fetch distinct ingredients
  getDistinctIngredients: async () => {
    const ingredients = await Meal.distinct('ingredients.name');
    return ingredients;
  },
};