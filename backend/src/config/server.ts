import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { expressMiddleware } from '@apollo/server/express4';
import { resolvers } from '../resolvers/index.js';
import { typeDefs } from '../schemas/index.js';
import { connectDatabase } from '../config/database.js';
import { logger } from '../utils/logger.js';
import expressWinston from 'express-winston';


const createServer = async () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // // Apply logging middleware
  // app.use(expressWinston.logger({
  //   winstonInstance: logger,
  //   meta: true,
  //   msg: "HTTP {{req.method}} {{req.url}}",
  //   expressFormat: true,
  //   colorize: false,
  // }));

  // Connect to the database
  await connectDatabase();

  // Initialize Apollo Server
  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  // Start Apollo Server
  await server.start();

  // Set up Apollo Server middleware
  app.use(
    '/api/graphql',
    expressMiddleware(server),
  );

  return app;
};

export default createServer;
