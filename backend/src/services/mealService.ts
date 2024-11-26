import { FileUpload } from "graphql-upload/processRequest.mjs";
import path from 'path';
import fs from 'fs';
import { Meal } from "../models/Meal.js";
import { Image, IMealInput } from "../interfaces/interfaces.js";
import { mealSchema } from "../validators/mealValidator.js";
import sharp from "sharp";

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