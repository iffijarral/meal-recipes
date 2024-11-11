const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://mongodb:27017/meal-recipes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});
