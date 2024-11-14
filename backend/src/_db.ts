import mongoose, { ConnectOptions } from 'mongoose';

// MongoDB connection URL
const mongoURI = 'mongodb://mongodb:27017/meal-recipes';

// Options for Mongoose connect
const options: ConnectOptions = {
  // Any additional options can go here
};

// Connect to MongoDB
mongoose.connect(mongoURI, options)
  .then(() => {
    console.log('MongoDB database connection established successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
