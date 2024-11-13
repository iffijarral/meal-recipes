import express from 'express';
import mongoose from 'mongoose';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema';

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Use GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/graphql`);
});
