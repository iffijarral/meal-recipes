import mongoose from 'mongoose';
import { Meal } from './models/Meal.js'; // Adjust the path
import { connectDatabase } from './config/database.js'; // Import your backend's database connection setup

const updateDocuments = async () => {
  try {
    // Ensure the database is connected
    await connectDatabase(); // Reuse backend's database connection logic
    console.log('Database connected successfully.');

    // Perform the update
    const result = await Meal.updateMany({}, { $set: { isActive: true } });
    console.log(`${result.modifiedCount} documents were updated.`);
  } catch (error) {
    console.error('Error updating documents:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

updateDocuments();
