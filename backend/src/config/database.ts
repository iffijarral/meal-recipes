// app.ts (optional, could be used for additional setup if needed)
import mongoose from 'mongoose';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASSWORD,
      authSource: 'admin'
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
