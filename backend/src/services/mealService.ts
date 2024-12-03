import { FileUpload } from "graphql-upload/processRequest.mjs";
import path from 'path';
import fs from 'fs';
import { IMealDocument, Meal } from "../models/Meal.js";
import { Image, IMeal, IMealInput, IUser } from "../interfaces/interfaces.js";
import { mealSchema } from "../validators/mealValidator.js";
import sharp from "sharp";
import { IUserDocument } from "../models/User.js";
import { ObjectId } from "mongoose";

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
    try {
      const meal = await Meal.findById(id).populate('user');
      if (!meal) {
        throw new Error("Meal not found");
      }

      // Transform ingredients to remove _id if you don't need it
      const ingredients = meal.ingredients.map(ingredient => ({
        name: ingredient.name,
        measure: ingredient.measure
      }));

      // Check if meal.user is populated
      const user = transformUser(meal.user as IUserDocument);

      // if(user) console.log('the user in meal is', user);

      // Return the meal object as is because populate includes the user data
      return {
        id: meal._id.toString(),
        name: meal.name,
        category: meal.category,
        ingredients: ingredients,
        tags: meal.tags,
        area: meal.area,
        youtubeLink: meal.youtubeLink,
        image: meal.image,
        description: meal.description,
        user: user
      }
    } catch (error) {
      console.error("Error fetching meals by Id:", error);
      throw new Error("Failed to fetch meals by Id");
    }
  },

   // Fetch meal by Name
   getMealByName: async (name: string) => {
    try {
      const meal = await Meal.findOne({ name }).populate('user');
      if (!meal) {
        throw new Error("Meal not found");
      }

      // Transform ingredients to remove _id if you don't need it
      const ingredients = meal.ingredients.map(ingredient => ({
        name: ingredient.name,
        measure: ingredient.measure
      }));

      // Check if meal.user is populated
      const user = transformUser(meal.user as IUserDocument);

      // if(user) console.log('the user in meal is', user);

      // Return the meal object as is because populate includes the user data
      return {
        id: meal._id.toString(),
        name: meal.name,
        category: meal.category,
        ingredients: ingredients,
        tags: meal.tags,
        area: meal.area,
        youtubeLink: meal.youtubeLink,
        image: meal.image,
        description: meal.description,
        user: user
      }
    } catch (error) {
      console.error("Error fetching meals by name:", error);
      throw new Error("No meal found for the given name.");
    }
  },
  // Fetch meal by ID
  getMealsByCategory: async (category: string) => {
    try {
      const meals = await Meal.find({ category }).populate('user');
      if (meals.length === 0) {
        throw new Error(`No meals found for category: ${category}`);
      }
      return meals.map((meal) => {
        const user = transformUser(meal.user as IUserDocument);
        return {
          id: meal._id.toString(),
          name: meal.name,
          category: meal.category,
          ingredients: meal.ingredients,
          tags: meal.tags,
          area: meal.area,
          youtubeLink: meal.youtubeLink,
          image: meal.image,
          description: meal.description,
          user
        }
      })
    } catch (error) {
      console.error("Error fetching meals by Category:", error);
      throw new Error("Failed to fetch meals");
    }
    
  },

  // Fetch all meals
  getAllMeals: async () => {
    try {
      const meals = await Meal.find({}).populate('user');

      return meals.map((meal) => {
        const user = transformUser(meal.user as IUserDocument);
        return {
          id: meal._id.toString(),
          name: meal.name,
          category: meal.category,
          ingredients: meal.ingredients,
          tags: meal.tags,
          area: meal.area,
          youtubeLink: meal.youtubeLink,
          image: meal.image,
          description: meal.description,
          user
        }
      })


    } catch (error) {
      console.error("Error fetching meals:", error);
      throw new Error("Failed to fetch meals");
    }
  },

  // Fetch distinct categories
  getDistinctCategories: async () => {
    try {
      // Fetch unique categories from the 'meals' collection
      const distinctCategories = await Meal.distinct('category');

      // Transform categories into the desired structure
      return distinctCategories.map((category, index) => ({
        idCategory: index.toString(), // Generated an ID as a string, though i don't need it at frontend
        strCategory: category,       // Used the category name
        strCategoryThumb: "",        // Placeholder for thumbnail. 
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  },

  // Fetch distinct ingredients
  getDistinctIngredients: async () => {
    const ingredients = await Meal.distinct('ingredients.name');
    return ingredients;
  },

  // Fetch distinct area
  getDistinctAreas: async () => {
    try {
      // Fetch unique categories from the 'meals' collection
      const distinctAreas = await Meal.distinct('area');

      // Transform categories into the desired structure
      return distinctAreas.map((area, index) => ({
        strArea: area,
      }));
    } catch (error) {
      console.error("Error fetching areas:", error);
      throw new Error("Failed to fetch areas");
    }
  },

  uploadImage: async (image: Promise<FileUpload>) => {
    const { filename, createReadStream } = await image;

    console.log(`Uploading ${filename}...`);

    // Define the uploads directory
    const uploadsDir = '/app/uploads';

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);

    return new Promise<Image>((resolve, reject) => {
      const stream = createReadStream();
      const writeStream = fs.createWriteStream(filePath);

      console.log("readStream created");

      stream.pipe(writeStream);

      console.log("writeStream setup");

      // Create new image object to return
      const newImage: Image = { filename };

      writeStream.on("finish", () => {
        console.log("Image uploaded successfully:", filePath);

        resolve(newImage); // Return the uploaded image metadata

      });

      writeStream.on("error", (err) => {
        console.error("Error during file upload:", err);
        reject(new Error("File upload failed")); // Reject the promise on error
      });
    });
  },

  generateThumbnail: async (filename: string) => {
    const uploadsDir = '/app/uploads';

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);

    const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

    if (!fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir);
    }

    // Generate the thumbnail path
    const thumbnailPath = path.join(thumbnailsDir, filename);

    sharp(filePath)
      .resize(200, 200, {
        fit: 'inside',
        withoutEnlargement: true // Optional: prevent upscaling if the image is smaller than the target dimensions
      }) // Resize to 200x200 pixels
      .toFile(thumbnailPath)
      .then(() => {
        console.log('Thumbnail generated successfully.');
      })
      .catch(err => {
        console.error('Error generating thumbnail:', err);
      });
  }

};

// Helper function to check if user is a populated document
const isIUserDocument = (user: IUserDocument | ObjectId): user is IUserDocument => {
  return (user as IUserDocument)._id !== undefined; // Check if _id exists, meaning it is a populated user
};

const transformUser = (user: IUserDocument): IUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
