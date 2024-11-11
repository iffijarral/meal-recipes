// models/Meal.js
const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: String,
  category: String,
  ingredients: [String],
  tags: [String],
  area: String,
  youtubeLink: String,
  image: String,
  description: String,
});

module.exports = mongoose.model('Meal', mealSchema);
