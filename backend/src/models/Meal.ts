// models/Meal.ts
import mongoose, { Schema, Document, Types } from 'mongoose'
import { IUserDocument } from './User.js';
import { IIngredient } from '../interfaces/interfaces.js';

// Ingredient type


interface IMealDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  category: string;
  ingredients: IIngredient[];
  tags?: string[];
  area: string;
  youtubeLink?: string;
  image: string;
  description: string;
  user: Types.ObjectId | IUserDocument;
  isActive: boolean;
}

const mealSchema: Schema<IMealDocument> = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  ingredients: [
    {
      name: { type: String, required: true },
      measure: { type: String, required: true },
    },
  ],
  tags: { type: [String] },
  area: { type: String },
  youtubeLink: { type: String },
  image: { type: String },
  description: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
});

const Meal = mongoose.model<IMealDocument>('Meal', mealSchema)
export { Meal, IMealDocument }
