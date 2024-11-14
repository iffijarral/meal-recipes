// models/Meal.ts
import mongoose, { Schema, Document, Types } from 'mongoose'
import { IUser } from './User.js';

interface IMeal extends Document {
  name: string;
  category: string;
  ingredients: string[];
  tags: string[];
  area: string;
  youtubeLink: string;
  image: string;
  description: string;
  user: Types.ObjectId | IUser;
}

const mealSchema: Schema<IMeal> = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  ingredients: { type: [String], required: false },
  tags: { type: [String], required: false },
  area: { type: String, required: false },
  youtubeLink: { type: String, required: false },
  image: { type: String, required: false },
  description: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Meal = mongoose.model<IMeal>('Meal', mealSchema)
export default Meal
