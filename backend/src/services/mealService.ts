import { FileUpload } from "graphql-upload/processRequest.mjs";
import path from 'path';
import fs from 'fs';
import { IMealDocument, Meal } from "../models/Meal.js";
import { IIngredient, Image, IMeal, IMealInput, IUser } from "../interfaces/interfaces.js";
import { mealSchema } from "../validators/mealValidator.js";
import sharp from "sharp";
import { IUserDocument, User } from "../models/User.js";
import mongoose, { ObjectId } from "mongoose";

const UPLOADS_DIRECTORY = '/app/uploads';

export const mealService = {
  // Creating a new meal
  createMeal: async (mealData: IMealInput) => {
    const { error } = mealSchema(false).validate(mealData); // Here false means image must be validated because its new meal
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
    try {
      const { error } = mealSchema(true).validate(mealData); // here true means its update operation and image is optional to validate
      if (error) {
        throw new Error(`Validation failed: ${error.details.map(e => e.message).join(", ")}`);
      }

      const updatedMeal = await Meal.findByIdAndUpdate(id, mealData, { new: true });

      if (!updatedMeal) {
        throw new Error("Meal not found");
      }

      // Transform ingredients to remove _id if you don't need it
      const ingredients = transformIngredients(updatedMeal);

      // Check if meal.user is populated
      const user = transformUser(updatedMeal.user as IUserDocument);

      // Return the meal object as is because populate includes the user data
      return {
        id: updatedMeal._id.toString(),
        name: updatedMeal.name,
        category: updatedMeal.category,
        ingredients: ingredients,
        tags: updatedMeal.tags,
        area: updatedMeal.area,
        youtubeLink: updatedMeal.youtubeLink,
        image: updatedMeal.image,
        description: updatedMeal.description,
        user: user
      }

    } catch (error) {
      console.error("Error updating meal:", error);
      throw new Error("Failed to update the meal");
    }

  },

  // Delete a meal
  deleteMeal: async (id: string) => {
    try {
      const deletedMeal = await Meal.findByIdAndDelete(id);

      if (!deletedMeal) {
        return {
          success: false,
          message: "Meal deletion failed",
          mealId: null,
        };
      }
      const imageName = deletedMeal.image;
      if(deleteImage(imageName)) {
        return {
          success: true,
          message: "Meal deleted successfully",
          mealId: id,
        };
      } else {
        return {
          success: true,
          message: "Meal deleted successfully but not image",
          mealId: id,
        };
      }
    } catch (error) {
      console.error("Error deleting meal:", error);
      return { success: false, message: "Error deleting meal" };
    }
  },

  // Fetch meal by ID
  getMealById: async (id: string) => {
    try {
      const meal = await Meal.findById(id).populate('user');
      if (!meal) {
        throw new Error("Meal not found");
      }

      // Transform ingredients to remove _id if you don't need it
      const ingredients = transformIngredients(meal);

      // Check if meal.user is populated
      const user = transformUser(meal.user as IUserDocument);

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
  // Fetch meal by category
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

  getMealsByArea: async (area: string) => {
    try {
      console.log('this is query area', area);
      const meals = await Meal.find({ area }).populate('user');
      if (meals.length === 0) {
        throw new Error(`No meals found for area: ${area}`);
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
      console.error("Error fetching meals by Area:", error);
      throw new Error("Failed to fetch meals by Area");
    }

  },
  getMealsByCategoryUser: async (category: string, userId: string) => {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      const isAdmin = user.role === 'admin';

      // Build the filter object based on user's role
      const filter = isAdmin
        ? { category } // Admin sees all meals in the category
        : { user: user._id, category }; // Non-admin sees only their meals in the category

      // Query the database with the filter
      const meals = await Meal.find(filter).populate('user');

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
  getCategoriesByUser: async (userId: string) => {
    try {

      // if (!mongoose.Types.ObjectId.isValid(userId)) {
      //   throw new Error('Invalid user ID');
      // }

      const user = await User.findById(userId);
      console.log('user is', user);
      if (!user) {
        throw new Error("User not found");
      }

      const isAdmin = user.role === 'admin';

      const filter = isAdmin ? {} : { user: user._id };

      const distinctCategories = await Meal.distinct('category', filter);

      return distinctCategories.map((category, index) => ({
        idCategory: index.toString(), // Generated an ID as a string, though i don't need it at frontend
        strCategory: category,       // Used the category name
        strCategoryThumb: "",        // Placeholder for thumbnail. 
      }));


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

const transformIngredients = (meal: IMealDocument): IIngredient[] => {
  const ingredients: IIngredient[] = meal.ingredients.map(ingredient => ({
    name: ingredient.name,
    measure: ingredient.measure
  }));

  return ingredients;
};

const deleteImage = (filename: string) => {
  const imagePath = path.join(UPLOADS_DIRECTORY, filename);
  const thumbnailPath = path.join(UPLOADS_DIRECTORY, 'thumbnails', filename);
  let imageDeleted = false;
  let thumbnailDeleted = false;

  // Delete main image
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    imageDeleted = true;
    console.log("Main image file deleted successfully:", imagePath);    
  } else {
    console.warn("Main image file does not exist:", imagePath);
  }

  // Delete thumbnail
  if (fs.existsSync(thumbnailPath)) {
    fs.unlinkSync(thumbnailPath);
    thumbnailDeleted = true;
    console.log("Main image file deleted successfully:", thumbnailPath);
  } else {
    console.warn("Main image file does not exist:", thumbnailPath);
  }

  return imageDeleted && thumbnailDeleted; 

}